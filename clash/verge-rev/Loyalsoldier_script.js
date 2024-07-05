// 全局配置组名的映射名称 key为正则的字符串 value为替换的值
const groupNameMapping = { "日本|Japan": "小日子" };
const groupNameRemoveRegexs = [/\[trojan\]\s+/g]
const groupNameSplitConfig = [
  { delimiter: "-", index: 0 },
  { delimiter: " ", index: 0 },
];

// split group name by area , for custom function
const findGroupName = (groupName) => {
  if (!groupName) {
    return groupName;
  }
  groupNameRemoveRegexs.forEach(regex => {
    groupName = groupName.replace(regex, "")
  })
  groupName = groupName
    .replace(/(?:\d+|[\s-]+\d+|\s+[Vv]+\d+)$/g, "")
    .replace(/^(?:\d+[\s-]+|\d+|[Vv]+\d+\s+)/g, "");
  let sc = groupNameSplitConfig.find(x => groupName.includes(x.delimiter))
  if (sc) {
    return groupName.split(sc.delimiter)[sc.index];
  }
  return groupName;
}
// github or cnd
const ruleProvidersUrlSrc = "github"
const ruleProvidersUrl = {
  "github": {
    "direct": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt",
    "proxy": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt",
    "reject": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt",
    "private": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt",
    "apple": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/apple.txt",
    "icloud": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/icloud.txt",
    "google": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt",
    "gfw": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt",
    "tld-not-cn": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/tld-not-cn.txt",
    "telegramcidr": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/telegramcidr.txt",
    "lancidr": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt",
    "cncidr": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt",
    "applications": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt",
  },
  "cdn": {
    "direct": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    "proxy": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
    "reject": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
    "private": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
    "apple": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
    "icloud": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
    "google": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
    "gfw": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
    "tld-not-cn": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
    "telegramcidr": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
    "lancidr": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
    "cncidr": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
    "applications": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
  }
}

const usedRuleProvidersUrl = ruleProvidersUrl[ruleProvidersUrlSrc]

const ruleAndProviders = {
  "rules": [
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,100.64.0.0/10,DIRECT,no-resolve",
    "IP-CIDR6,::1/128,DIRECT,no-resolve",
    "IP-CIDR6,fc00::/7,DIRECT,no-resolve",
    "IP-CIDR6,fe80::/10,DIRECT,no-resolve",
    "IP-CIDR6,fd00::/8,DIRECT,no-resolve",
    "DOMAIN,download-cdn.jetbrains.com,DIRECT",
    "DOMAIN-SUFFIX,dingteam.com,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,dingtalk.com,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,aliyun.com,DIRECT",
    "DOMAIN-SUFFIX,aliyuncs.com,DIRECT",
    "DOMAIN-SUFFIX,microsoft.com,DIRECT",
    "DOMAIN-SUFFIX,msn.com,DIRECT",
    "DOMAIN-SUFFIX,msn.cn,DIRECT",
    "DOMAIN-SUFFIX,live.com,DIRECT",
    "DOMAIN-SUFFIX,cdntips.net,DIRECT",
    "RULE-SET,applications,DIRECT",
    "RULE-SET,private,DIRECT",
    "RULE-SET,reject,REJECT",
    "RULE-SET,proxy,节点选择",
    // "RULE-SET,google,PROXY",
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",
    "RULE-SET,direct,DIRECT",
    "RULE-SET,lancidr,DIRECT",
    "RULE-SET,cncidr,DIRECT",
    "RULE-SET,tld-not-cn,节点选择",
    "RULE-SET,gfw,节点选择",
    "RULE-SET,telegramcidr,节点选择",
    "GEOIP,LAN,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择"
  ],
  "rule-providers": {
    // 直连域名列表
    "direct": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['direct']}`,
      "path": "./ruleset/direct.yaml",
      "interval": 86400
    },
    // 代理域名列表
    "proxy": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['proxy']}`,
      "path": "./ruleset/proxy.yaml",
      "interval": 86400
    },
    // 广告域名列表
    "reject": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['reject']}`,
      "path": "./ruleset/reject.yaml",
      "interval": 86400
    },
    // 私有网络专用域名列表
    "private": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['private']}`,
      "path": "./ruleset/private.yaml",
      "interval": 86400
    },
    // Apple 在中国大陆可直连的域名列表
    "apple": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['apple']}`,
      "path": "./ruleset/apple.yaml",
      "interval": 86400
    },
    // iCloud 域名列表
    "icloud": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['icloud']}`,
      "path": "./ruleset/icloud.yaml",
      "interval": 86400
    },
    // [慎用]Google 在中国大陆可直连的域名列表
    "google": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['google']}`,
      "path": "./ruleset/google.yaml",
      "interval": 86400
    },
    // GFWList 域名列表
    "gfw": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['gfw']}`,
      "path": "./ruleset/gfw.yaml",
      "interval": 86400
    },
    // 非中国大陆使用的顶级域名列表
    "tld-not-cn": {
      "type": "http",
      "behavior": "domain",
      "url": `${usedRuleProvidersUrl['tld-not-cn']}`,
      "path": "./ruleset/tld-not-cn.yaml",
      "interval": 86400
    },
    // Telegram 使用的 IP 地址列表
    "telegramcidr": {
      "type": "http",
      "behavior": "ipcidr",
      "url": `${usedRuleProvidersUrl['telegramcidr']}`,
      "path": "./ruleset/telegramcidr.yaml",
      "interval": 86400
    },
    // 局域网 IP 及保留 IP 地址列表
    "lancidr": {
      "type": "http",
      "behavior": "ipcidr",
      "url": `${usedRuleProvidersUrl['lancidr']}`,
      "path": "./ruleset/lancidr.yaml",
      "interval": 86400
    },
    // 中国大陆 IP 地址列表
    "cncidr": {
      "type": "http",
      "behavior": "ipcidr",
      "url": `${usedRuleProvidersUrl['cncidr']}`,
      "path": "./ruleset/cncidr.yaml",
      "interval": 86400
    },
    // 需要直连的常见软件列表
    "applications": {
      "type": "http",
      "behavior": "classical",
      "url": `${usedRuleProvidersUrl['applications']}`,
      "path": "./ruleset/applications.yaml",
      "interval": 86400
    }
  }
};

function main(config) {
  if (!config.dns) {
    config.dns = {};
  }
  const nameserverPolicy = {
    "geosite:geolocation-!cn": [
      "tls://1.1.1.1:853",
      "https://doh.pub/dns-query",
    ],
    "geosite:gfw": ["tls://1.1.1.1:853", "https://doh.pub/dns-query"],
    "geosite:cn": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query",
    ],
  };
  const originNameserverPolicy = config.dns["nameserver-policy"] || {};
  config.dns["nameserver-policy"] = {
    ...originNameserverPolicy,
    ...nameserverPolicy,
  };

  const fallback = ["tls://1.1.1.1:853", "tls://1.0.0.1:853", "101.6.6.6:5353"];
  const originFallback = config.dns["fallback"] || [];
  config.dns["fallback"] = [...originFallback, ...fallback];

  const fakeIpFilter = ["+.apple.com"];
  const originFakeIpFilter = config.dns["fake-ip-filter"] || [];
  config.dns["fake-ip-filter"] = [...originFakeIpFilter, ...fakeIpFilter];
  if (!config.proxies) {
    return config;
  }
  const { selectGroup, autoSelectGroup } = findRegionProxyGroups(config);
  const allProxyGroup = findAllProxyGroup(config, autoSelectGroup, false);

  config["proxy-groups"] = [
    ...allProxyGroup,
    ...selectGroup,
    ...autoSelectGroup,
  ];

  config["rule-providers"] = ruleAndProviders["rule-providers"];
  config["rules"] = ruleAndProviders["rules"];
  return config;
}

/**
 * 获取全部节点的代理组
 */
function findAllProxyGroup(config, proxyGroup, containProxy) {
  const proxy_names = config.proxies.map((proxy) => proxy.name);
  const addProxyGroup = (proxyGroup && proxyGroup.map((g) => g.name)) || [];
  const select_proxy_names = containProxy
    ? ["自动选择", ...addProxyGroup, ...proxy_names]
    : ["自动选择", ...addProxyGroup];
  const select = {
    name: "节点选择",
    type: "select",
    proxies: select_proxy_names,
  };
  const url_test = {
    name: "自动选择",
    type: "url-test",
    proxies: proxy_names,
    url: "http://www.gstatic.com/generate_204",
    interval: 86400,
  };
  const fallback = {
    name: "故障转移",
    type: "fallback",
    proxies: proxy_names,
    url: "http://www.gstatic.com/generate_204",
    interval: 7200,
  };
  return [select, url_test, fallback];
}

/**
 * 获取地区节点的代理组
 * @param {number} [minProxyCount=5] 当组内节点小于这个值时都归为其他组
 */
function findRegionProxyGroups(config, minProxyCount = 5) {
  if (!config.proxies && !Array.isArray(config.proxies)) {
    return [];
  }
  const proxyGroups = config.proxies
    .map((proxy) => proxy.name)
    .reduce((groups, item) => {
      //去除末尾和开头的数字和其他字符
      let groupName = findGroupName(item);
      let proxyNames = groups[groupName] || [];
      groups[groupName] = [...proxyNames, item];
      return groups;
    }, {});
  const proxySelectGroup = [],
    proxyAutoSelectGroup = [],
    otherProxyNames = [];
  for (const key in proxyGroups) {
    const originProxyNames = proxyGroups[key];
    if (originProxyNames.length < minProxyCount) {
      otherProxyNames.push(...originProxyNames);
      continue;
    }
    const { selectGroup, autoSelectGroup } = toGroupByProxyNames(
      key,
      originProxyNames
    );
    proxySelectGroup.push(selectGroup);
    proxyAutoSelectGroup.push(autoSelectGroup);
  }
  if (otherProxyNames && otherProxyNames.length > 0) {
    const { selectGroup, autoSelectGroup } = toGroupByProxyNames(
      "其他地区",
      otherProxyNames
    );
    proxySelectGroup.push(selectGroup);
    proxyAutoSelectGroup.push(autoSelectGroup);
  }
  return {
    selectGroup: proxySelectGroup,
    autoSelectGroup: proxyAutoSelectGroup,
  };
}

/**
 * 根据节点组名称和节点名称列表转换成节点组列表
 */
function toGroupByProxyNames(groupName, proxyNames) {
  let realGroupName = groupName;
  for (const nameRegex in groupNameMapping) {
    let matchName = RegExp(nameRegex).test(groupName);
    if (matchName) {
      realGroupName = groupNameMapping[nameRegex];
      break;
    }
  }
  const autoSelectGroupName = "自动选择-" + realGroupName;
  const selectProxyName = [autoSelectGroupName, ...proxyNames];
  const selectGroup = {
    name: realGroupName,
    type: "select",
    proxies: selectProxyName,
  };
  const autoSelectGroup = {
    name: autoSelectGroupName,
    type: "url-test",
    proxies: proxyNames,
    url: "http://www.gstatic.com/generate_204",
    interval: 86400,
  };
  return { selectGroup, autoSelectGroup };
}