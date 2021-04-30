import { server } from '../../config';
import { StageFeatureSet } from '../../types';

interface ComponentProps {
  response: StageFeatureSet[];
}
const AnalysisPage: React.FC<ComponentProps> = (props) => {
  console.log(props);
  return <div>Hello!</div>;
};

export default AnalysisPage;

export async function getStaticProps() {
  // TODO: ** all getStaticProps functions should call server functions directly, not an api route, and fetch() should not be used since getStaticProps is always run on the server directly
  // cf. https://stackoverflow.com/questions/65981235/how-to-make-a-request-to-an-api-route-from-getstaticprops for more information.
  try {
    const response = await (await fetch(`${server}/api/texts`)).json();
    const textTitles = response?.Nestle1904.text.map(
      (textContainer: TextFromAPITexts) => textContainer.$.title,
    );
    return {
      props: {
        textTitles,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
