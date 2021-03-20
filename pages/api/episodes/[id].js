import episodes from '../../../data/episodes-ranges.xml'

const handler = (req, res) => {
  const id = req.query.id
  const selectedEpisodeArray = episodes.root.episode.filter(episode => episode.$.section === id)
  if(selectedEpisodeArray){
      res.status(200).json(selectedEpisodeArray[0])
  } else {
      res.status(404).json({message: `Episode with id ${id} not found.`})
  }
}

export default handler;

// TODO: these routes should be determined by the title, not the id, for SEO purposes