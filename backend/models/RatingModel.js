// DB is lazy-loaded only when USE_POSTGRES=true
const getDb = () => require('../config/db');


const ratingsDb = [];

class RatingModel {
  static async create({ tripId, driverId, rating, tags, comment }) {
    const record = {
      id: `RAT-${Date.now()}`,
      tripId,
      driverId,
      rating: Number(rating),
      tags: tags || [],
      comment: comment || '',
      createdAt: new Date().toISOString(),
    };

    if (process.env.USE_POSTGRES === 'true') {
      try {
        const query = `
          INSERT INTO ratings (trip_id, driver_id, rating, tags, comment)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const res = await getDb().query(query, [tripId, driverId, rating, JSON.stringify(tags), comment]);

        return res.rows[0];
      } catch (err) {
        console.warn('PostgreSQL rating insert fallback:', err.message);
      }
    }

    ratingsDb.push(record);
    return record;
  }

  static async getDriverStats(driverId) {
    const driverRatings = ratingsDb.filter((r) => String(r.driverId) === String(driverId));
    if (driverRatings.length === 0) {
      return { averageRating: 5.0, totalRatings: 0, reviews: [] };
    }

    const sum = driverRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = (sum / driverRatings.length).toFixed(1);

    return {
      averageRating: parseFloat(avg),
      totalRatings: driverRatings.length,
      reviews: driverRatings.slice(-10),
    };
  }

  static validateRating(score, comment = '') {
    const numScore = Math.max(1, Math.min(5, Number(score) || 5));
    const cleanComment = String(comment).trim().slice(0, 300);
    return { score: numScore, comment: cleanComment };
  }

  static async getFleetSummary() {
    const totalRatings = ratingsDb.length;
    const avg = totalRatings
      ? (ratingsDb.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1)
      : 4.9;

    return {
      totalRatings,
      averageRating: parseFloat(avg),
    };
  }
}

module.exports = RatingModel;
