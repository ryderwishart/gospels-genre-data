const dev = process.env.NODE_ENV !== 'production';

console.log(process.env.NODE_ENV)
export const server = dev 
    ? 'http://localhost:1337'
    : 'https://opentext.vercel.app/'

// export const server = 'http://localhost:1337'