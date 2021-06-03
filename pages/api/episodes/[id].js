import episodes from '../../../public/data/stages/episodes-ranges.xml';

// Each episode should have data on pre and via text features, as well as start range, etc.

// start="SBLGNT.Matt.1.1.w1" section="01§01" morphGntId="010101"
//         title="The Genealogy of Christ"

const handler = (req, res) => {
  const id = req.query.id;
  let selectedEpisodeArray;
  try {
    selectedEpisodeArray = episodes.root.episode.filter(
      (episode) => episode.$.section === id,
    );
  } catch (error) {
    selectedEpisodeArray = null;
  }
  if (selectedEpisodeArray.length > 0) {
    res.status(200).json(selectedEpisodeArray[0]);
  } else {
    res.status(404).json({ message: `Episode with id ${id} not found.` });
  }
};

export default handler;

// TODO: these routes should be determined by the title, not the id, for SEO purposes
