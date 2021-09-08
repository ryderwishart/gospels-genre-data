import Layout from '../../components/Layout';
import Link from 'next/link';

const AboutPage = () => {
  const description =
    'OpenText exists to advance research in linguistics and Greek New Testament studies through innovative functional-linguistic analyses, datasets, and resources.';
  return (
    <Layout pageTitle="About Opentext.org" pageDescription={description}>
      <div>{description}</div>
      <br />
      <div>
        The OpenText project is affiliated with{' '}
        <Link href="https://cblte.mcmasterdivinity.ca/">
          <a>the Center for Biblical Linguistics Translation and Exegesis</a>
        </Link>
        .
      </div>
    </Layout>
  );
};

export default AboutPage;
