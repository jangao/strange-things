let x = main({
  "proxies": [
    {
      "name": "[trojan] 张三 01",
    },
    {
      "name": "[trojan] 张三 02",
    },
    {
      "name": "[trojan] 张三 03",
    },
    {
      "name": "[trojan] 张三 04",
    },
    {
      "name": "[trojan] 张三 05",
    },
    {
      "name": "😁 李四-自行车 BGP 1",
    },
    {
      "name": "😁 李四-自行车 BGP 1",
    },
    {
      "name": "😁 李四-摩托车 BGP 2",
    },
    {
      "name": "😁 李四-摩托车 BGP 2",
    },
    {
      "name": "😁 李四-摩托车 Akari",
    }]
})
console.log(JSON.stringify(x['proxy-groups']))