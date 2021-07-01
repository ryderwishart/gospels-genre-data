const dev = process.env.NODE_ENV !== 'production';

export const server = dev
  ? 'http://localhost:1337'
  : 'https://opentext.vercel.app';

// export const server = 'http://localhost:1337';
// export const server = 'https://opentext.vercel.app/';

export const SignificantDimensionThresholdValue = 0.13;

export const defaultSEOMeta = {
  pageTitle: 'OpenText',
  pageDescription:
    'Creators of open-sourced Greek New Testament annotations using a functional-linguistic framework.',
};

export const constants = {
  color: {
    blue: '#1890ff',
    lightGrey: '#8181813d',
    red: '#cf1322',
  },
};
