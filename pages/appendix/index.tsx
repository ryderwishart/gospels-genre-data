import Layout from '../../components/Layout';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import { ApartmentOutlined, PictureOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export default function Appendices() {
  return (
    <Layout pageTitle="Appendices">
      <Link href="/appendix/principal-components">
        <a>
          <div className={styles.card}>
            <Tooltip title="Contextual Data Table">
              <PictureOutlined />
            </Tooltip>
            {'  '}
            Situation Principal Component Scores
            <br />
            <span style={{ color: 'black' }}>
              All of the principal-component scores for each situation
            </span>
          </div>
        </a>
      </Link>
      <Link href="/appendix/principal-component-features">
        <a>
          <div className={styles.card}>
            <Tooltip title="Contextual Data Table">
              <PictureOutlined />
            </Tooltip>
            {'  '}
            Principal Component Feature Correlations
            <br />
            <span style={{ color: 'black' }}>
              How much each feature correlates with each principal component
            </span>
          </div>
        </a>
      </Link>
      <Link href="/appendix/situations-graph">
        <a>
          <div className={styles.card}>
            <Tooltip title="Contextual Data Table">
              <PictureOutlined />
            </Tooltip>
            {'  '}
            Graph of All Situation Similarities
            <br />
            <span style={{ color: 'black' }}>
              A Graph of all situation clusters given a user-specified
              similarity threshold
            </span>
          </div>
        </a>
      </Link>
      <Link href="/appendix/feature-sets">
        <a>
          <div className={styles.card}>
            <Tooltip title="Grammatical Data Table">
              <ApartmentOutlined rotate={270} />
            </Tooltip>
            {'  '}
            Grammatical Features by Order of Text
            <br />
            <span style={{ color: 'black' }}>
              Tallies of all grammatical features for each order of text
            </span>
          </div>
        </a>
      </Link>
      <Link href="/appendix/situation-similarity-by-grammar">
        <a>
          <div className={styles.card}>
            <Tooltip title="Grammatical and Contextual Data Table">
              <PictureOutlined /> <ApartmentOutlined rotate={270} />
            </Tooltip>
            {'  '}
            Situation Cosine Similarity by Grammatical Features
            <br />
            <span style={{ color: 'black' }}>
              Degree of similarity between every situation based on grammatical
              probabilities
            </span>
          </div>
        </a>
      </Link>
      <Link href="/appendix/cluster-to-situation-similarity">
        <a>
          <div className={styles.card}>
            <Tooltip title="Grammatical and Contextual Data Table">
              <PictureOutlined /> <ApartmentOutlined rotate={270} />
            </Tooltip>
            {'  '}
            Cluster-to-Situation Cosine Similarity by Grammatical Features
            <br />
            <span style={{ color: 'black' }}>
              Degree of similarity between clusters and situations based on
              grammatical probabilities
            </span>
          </div>
        </a>
      </Link>
    </Layout>
  );
}
