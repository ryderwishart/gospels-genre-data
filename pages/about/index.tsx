import Layout from '../../components/Layout';
import Link from 'next/link';

const AboutPage = () => {
  const description =
    'OpenText exists to advance research in linguistics and Greek New Testament studies through innovative functional-linguistic analyses, datasets, and resources.';
  return (
    <Layout
      pageTitle="Register Analysis of the Gospels"
      pageDescription={'Data for genre and register analysis of the gospels'}
    >
      <h2>What is contained on this website?</h2>
      <div>
        This website documents the data and findings of Ryder Wishart&apos;s
        dissertation research. Please reach out to ryderwishart (at gmail dot
        com) for more information.
      </div>
      <br />
      <div>All data are created by the OpenText project. {description}</div>
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
