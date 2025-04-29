const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());

const driver = neo4j.driver(
  'bolt://localhost:7689',
  neo4j.auth.basic('neo4j', '12345678')
);

app.get('/citations/:paperId', async (req, res) => {
  const paperId = req.params.paperId;
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (:Paper {paper_id: $paperId})-[:CITES]->(cited:Paper)
      RETURN cited.paper_id AS paper_id, cited.title AS title
      `, { paperId }
    );

    const data = result.records.map(record => ({
      paper_id: record.get('paper_id'),
      title: record.get('title')
    }));

    res.json(data);
  } catch (error) {
    console.error('Neo4j query error:', error);
    res.status(500).send('Something went wrong');
  } finally {
    await session.close();
  }
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
