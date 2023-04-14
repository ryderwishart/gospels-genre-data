import situationsFeatures from '../../../public/data/stages/situations_data.json';

const findSituationByURL = (urlValue) => {
  
  return situationsFeatures.find((situation) => {
    if (situation.token_ids.includes(urlValue)) {
      return true;
    }

    return situation.token_refs.some((ref) => ref.includes(urlValue));
  });
};

const handler = (req, res) => {
  console.log('req.query', req.query)
  const urlValue = req.query.token;
  // decode url value
  const decodedUrlValue = decodeURIComponent(urlValue);

  try {
    const matchingSituation = findSituationByURL(decodedUrlValue);

    if (matchingSituation !== undefined) {
      res.status(200).json({ matchingSituation });
    } else {
      res.status(404).json({
        message: `Situation with URL value '${decodedUrlValue}' not found.`,
      });
    }
  } catch (error) {
    console.warn(
      'Encountered an error trying to match the URL query string with a situation',
      req.query,
      { error }
    );
    res.status(500).json({
      message: `An error occurred while searching for the situation with URL value '${decodedUrlValue}'.`,
    });
  }
};

export default handler;
