// 全局配置组名的映射名称 key为正则的字符串 value为替换的值
const groupNameMapping = { "日本|Japan": "小日子" };
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
    "RULE-SET,OpenAI,小日子",
    "RULE-SET,Global,节点选择",
    "RULE-SET,Global_Domain,节点选择",
    "RULE-SET,ChinaMax,DIRECT",
    "RULE-SET,ChinaMax_Domain,DIRECT",
    "RULE-SET,ChinaMax_IP,DIRECT",
    "GEOIP,LAN,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择"
  ],
  "rule-providers": {
    "Global": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Global/Global.yaml",
      "path": "./rules/Global.yaml",
      "interval": 86400
    },
    "Global_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "yaml",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Global/Global_Domain.yaml",
      "path": "./rules/Global_Domain.yaml",
      "interval": 86400
    },
    "ChinaMax_No_Resolve": {
      "type": "http",
      "behavior": "domain",
      "format": "yaml",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Global/ChinaMax_No_Resolve.yaml",
      "path": "./rules/ChinaMax_No_Resolve.yaml",
      "interval": 86400
    },
    "ChinaMax": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaMax/ChinaMax.yaml",
      "path": "./rules/ChinaMax.yaml",
      "interval": 86400
    },
    "ChinaMax_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "yaml",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaMax/ChinaMax_Domain.yaml",
      "path": "./rules/ChinaMax_Domain.yaml",
      "interval": 86400
    },
    "ChinaMax_IP": {
      "type": "http",
      "behavior": "ipcidr",
      "format": "yaml",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/ChinaMax/ChinaMax_IP.yaml",
      "path": "./rules/ChinaMax_IP.yaml",
      "interval": 86400
    },
    "OpenAI": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml",
      "path": "./rules/OpenAI.yaml",
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
      let groupName = item
        .replace(/(?:\d+|[\s-]+\d+|\s+[Vv]+\d+)$/g, "")
        .replace(/^(?:\d+[\s-]+|\d+|[Vv]+\d+\s+)/g, "");
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
