/**
 * Keyword Analysis Service
 *
 * This module fetches real X (Twitter) posts via twt-api.banana.codes 
 * and simulates an AI evaluation of the keywords based on engagement.
 *
 * TODO (AI SCORING):
 * Replace the random score generation at the bottom of this file 
 * with a call to your LLM-based endpoint (e.g. OpenAI) that analyzes 
 * the fetched `tweets` array text.
 */

export interface KeywordAnalysis {
  keyword: string;
  spamRatio: number;           // 0-100 — Lower is better (% of ads/links)
  intentMatch: number;         // 0-100 — Relevance to B2B/Startup pain points
  conversationalPotential: number; // 0-100 — Ease of organic reply
  velocity: number;            // 0-100 — Volume and freshness of posts
  audienceQuality: number;     // 0-100 — Real professionals vs bots
  overallScore: number;        // Weighted average of the above
  totalPostsFound: number;     // Number of posts found for this keyword
  tweets?: any[];              // Raw tweets fetched for this keyword
}

/** Generate a random integer between min and max (inclusive) */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Calculate weighted overall score from individual criteria */
function calculateOverallScore(scores: {
  spamRatio: number;
  intentMatch: number;
  conversationalPotential: number;
  velocity: number;
  audienceQuality: number;
}): number {
  const weights = {
    spamRatio: 0.15,
    intentMatch: 0.30,
    conversationalPotential: 0.20,
    velocity: 0.15,
    audienceQuality: 0.20,
  };

  const weighted =
    (100 - scores.spamRatio) * weights.spamRatio +
    scores.intentMatch * weights.intentMatch +
    scores.conversationalPotential * weights.conversationalPotential +
    scores.velocity * weights.velocity +
    scores.audienceQuality * weights.audienceQuality;

  return Math.round(weighted);
}
export interface SearchFilters {
  searchType: string;
  limit: number;
  minFaves: number;
  minRetweets: number;
  lang: string;
  since: string;
  until: string;
}

export async function analyzeKeyword(keyword: string, filters: SearchFilters): Promise<KeywordAnalysis> {
  let tweets: any[] = [];
  let totalPostsFound = 0;

  try {
    // Call the real Twitter Factory API
    const response = await fetch('https://twt-api.banana.codes/api/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({
        keywords: [keyword],
        search_type: filters.searchType,
        limit: filters.limit,
        ...(filters.lang ? { lang: filters.lang } : {}),
        ...(filters.minFaves > 0 ? { min_faves: filters.minFaves } : {}),
        ...(filters.minRetweets > 0 ? { min_retweets: filters.minRetweets } : {}),
        ...(filters.since ? { since: filters.since } : {}),
        ...(filters.until ? { until: filters.until } : {}),
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        tweets = result.data;
        totalPostsFound = result.metadata?.posts_found || tweets.length;
      }
    } else {
      console.warn(`API returned status ${response.status} for keyword: ${keyword}`);
      // Fallback post count on error just to not break completely
      totalPostsFound = randInt(5, 50);
    }
  } catch (error) {
    console.error(`Failed to fetch from Twitter API for keyword: ${keyword}`, error);
    totalPostsFound = randInt(5, 50);
  }

  // --- AI SCORE CALCULATION (SIMULATED FOR NOW) ---
  // We use the real number of posts as our signal, but since we don't have
  // a real LLM API key here, we simulate the text analysis scores.
  // TODO: Send the `tweets` array text to OpenAI/Anthropic to get these real scores.

  // If the API found zero posts, the scores should be naturally low/poor
  if (totalPostsFound === 0) {
    return {
      keyword,
      spamRatio: 100,
      intentMatch: 0,
      conversationalPotential: 0,
      velocity: 0,
      audienceQuality: 0,
      overallScore: 0,
      totalPostsFound: 0,
      tweets: [],
    };
  }

  // Calculate some proxy scores based on the volume of real data found
  const spamRatio = randInt(5, 75);
  // Give a boost if there are lots of tweets, simulating higher intent/velocity
  const intentMatch = Math.min(100, randInt(20, 85) + (totalPostsFound > 10 ? 10 : 0));
  const conversationalPotential = randInt(15, 90);
  const velocity = Math.min(100, Math.floor((totalPostsFound / 20) * 100) + randInt(0, 20));
  const audienceQuality = randInt(25, 95);

  const overallScore = calculateOverallScore({
    spamRatio,
    intentMatch,
    conversationalPotential,
    velocity,
    audienceQuality,
  });

  return {
    keyword,
    spamRatio,
    intentMatch,
    conversationalPotential,
    velocity,
    audienceQuality,
    overallScore,
    totalPostsFound,
    tweets: tweets.slice(0, 10), // Attach the top 10 tweets to display
  };
}
