## Get start
It is recommended you to use `cnpm` instead of `npm` in China.
### Install dependencies.
`npm install`
### development
`npm start` or `npm serve`

## Config file
### `.htmlhintrc`
> [All Rules](https://github.com/yaniswang/HTMLHint/wiki/Rules)
```
{
  "tagname-lowercase": true, // 标签名小写
  "attr-lowercase": true, // 属性名小写
  "attr-value-double-quotes": true, // 属性值双引号
  "attr-no-duplication": true, // 属性不重复
  "title-require": true, // title 标签只能出现在head标签下
  "id-unique": true, // id 唯一
  "spec-char-escape": true, // 特殊字符需转义,如"<",">"
  "tag-self-close": true, // 自包含标签需要关闭符,如<br />
  "tag-pair": true, // 标签配对
  "id-class-ad-disabled": true, // 不出现"ad"前缀的id或class值写法,会被广告拦截
  "id-class-value": "dash", // id, class 只允许使用连接符"-"
  "inline-script-disabled": true, // 不允许在标签内写 script
  "head-script-disabled": true // <script> 标签只能写在 body 尾部
}
```
