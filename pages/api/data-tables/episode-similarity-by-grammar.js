import episodeSimilarities from '../../../public/data/stages/features/stage-cosine-similarities-by-grammar.json';

export default function handler(req, res) {
  res.status(200).send(episodeSimilarities);
}
