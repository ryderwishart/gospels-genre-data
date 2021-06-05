const dev = process.env.NODE_ENV !== 'production';

export const server = dev
  ? 'http://localhost:1337'
  : 'https://opentext.vercel.app/';

// export const server = 'http://localhost:1337';
// export const server = 'https://opentext.vercel.app/'

export const defaultSEOMeta = {
  pageTitle: 'OpenText',
  pageDescription:
    'Creators of open-sourced Greek New Testament annotations using a functional-linguistic framework.',
};
