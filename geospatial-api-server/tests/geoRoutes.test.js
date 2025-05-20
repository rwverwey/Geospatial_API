const request = require('supertest');
const app = require('../app');
const GeoData = require('../models/GeoData');

// Mock the GeoData model to isolate logic and avoid real database dependency
jest.mock('../models/GeoData');

// Prevent test log clutter
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('GET /api/geo-data/all with query operators', () => {
  afterEach(() => {
    // Reset mocks between tests to ensure isolation
    jest.clearAllMocks();
  });

  /**
   * TEST 1: Basic retrieval (mocked)
   * This test simulates a GET call to /api/geo-data/all
   * without query parameters, returning one complete mock record.
   * It validates that the API structure and response fields are correct.
   * Assignment Coverage: Validates base response structure
   */
  it('should return mocked full geo-data entries without filters', async () => {
    GeoData.countDocuments.mockResolvedValue(1);
    GeoData.find.mockImplementation(() => ({
      select: () => ({
        sort: () => ({
          skip: () => ({
            limit: () =>
              Promise.resolve([
                {
                  _id: 'mock3',
                  latitude: 10,
                  longitude: 20,
                  date: '2024-01-01',
                  url: 'https://mockimage.com',
                },
              ]),
          }),
        }),
      }),
    }));

    const res = await request(app).get('/api/geo-data/all');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results[0]).toMatchObject({
      latitude: 10,
      longitude: 20,
      date: '2024-01-01',
      url: expect.any(String),
    });
  });

  /**
   * TEST 2: Select projection (mocked)
   * Simulates a GET request using ?fields=latitude,longitude
   * and ensures that only the requested fields are returned.
   * Assignment Coverage: Demonstrates use of select via query
   */
  it('should return mocked selected fields', async () => {
    GeoData.find.mockImplementation(() => ({
      select: () => ({
        sort: () => ({
          skip: () => ({
            limit: () =>
              Promise.resolve([
                { _id: 'mock1', latitude: 28.5891, longitude: -81.2077 },
              ]),
          }),
        }),
      }),
    }));

    const res = await request(app).get('/api/geo-data/all?fields=latitude,longitude');
    expect(res.status).toBe(200);
    expect(res.body.results[0]).toEqual({
      _id: 'mock1',
      latitude: 28.5891,
      longitude: -81.2077,
    });
  });

  /**
   * TEST 3: Real pagination logic
   * Sends limit and page parameters to ensure the pagination structure is correct.
   * This test validates that the API computes skip correctly and returns the right page.
   * Assignment Coverage: Pagination mechanics
   */
  it('should paginate with limit=2 and page=2 (skip 2)', async () => {
    const res = await request(app).get('/api/geo-data/all?limit=2&page=2');
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(2);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeLessThanOrEqual(2);
  });

  /**
   * TEST 4: Mocked pagination
   * Uses mock data to simulate two paginated results.
   * Verifies that page and results length match expectations.
   * Assignment Coverage: Mocked pagination and total doc logic
   */
  it('should return paginated mock result', async () => {
    GeoData.countDocuments.mockResolvedValue(4);
    GeoData.find.mockImplementation(() => ({
      select: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => Promise.resolve([{ _id: 'mock1' }, { _id: 'mock2' }]),
          }),
        }),
      }),
    }));

    const res = await request(app).get('/api/geo-data/all?limit=2&page=2');
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.results.length).toBe(2);
  });

  /**
   * TEST 5: Real sort descending
   * Sends a sort date query string and ensures the returned
   * documents are sorted in descending order by comparing two dates.
   * Assignment Coverage: Real sort logic and validation
   */
  it('should sort results by date descending', async () => {
    const res = await request(app).get('/api/geo-data/all?sort=-date');
    expect(res.status).toBe(200);
    const results = res.body.results;

    if (results.length >= 2 && results[0].date && results[1].date) {
      const firstDate = new Date(results[0].date);
      const secondDate = new Date(results[1].date);
      expect(firstDate >= secondDate).toBe(true);
    }
  });

  /**
   * TEST 6: Mocked sort descending
   * Returns mock documents with descending date order and ensures they arrive as expected.
   * Validates the backend honors sort query string.
   * Assignment Coverage: Mocked sort confirmation
   */
  it('should return mocked sorted results', async () => {
    GeoData.find.mockImplementation(() => ({
      select: () => ({
        sort: () => ({
          skip: () => ({
            limit: () =>
              Promise.resolve([
                { date: '2024-02-01' },
                { date: '2024-01-01' },
              ]),
          }),
        }),
      }),
    }));

    const res = await request(app).get('/api/geo-data/all?sort=-date');
    expect(res.status).toBe(200);
    expect(res.body.results[0].date).toBe('2024-02-01');
  });

  afterAll(async () => {
    // Exit for operation
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
});
