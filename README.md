# promise-polyfill

![Build Status](https://img.shields.io/travis/huang-xiao-jian/promise-polyfill/master.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/huang-xiao-jian/promise-polyfill/badge.svg?branch=master)](https://coveralls.io/github/huang-xiao-jian/?branch=master)
![Package Dependency](https://david-dm.org/huang-xiao-jian/promise-polyfill.svg?style=flat)
![Package DevDependency](https://david-dm.org/huang-xiao-jian/promise-polyfill/dev-status.svg?style=flat)

yet, another polyfill implement Promise/A+


## Usage

```shell
# browser development server
npm run dev;

# unit test with coverage
npm run test;

# production compile
npm run compile;
```

## Attention

+ tsc compiler compile without `polyfill`, which means `esnext` native
+ babel compiler compile both `commonjs` and `esm` style
+ remember to change meta field in the `package.json`
+ compile script automatically run before publish, no need for manual compile

## Contact

hjj491229492@hotmail.com

## License

MIT
