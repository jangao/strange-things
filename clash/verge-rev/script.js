// 全局配置组名的映射名称 key为正则的字符串 value为替换的值
const groupNameMapping = { "日本|Japan": "小日子" }
function main(config) {
  if (!config.dns) {
    config.dns = {}
  }
  const nameserverPolicy = {
    "geosite:geolocation-!cn": ['tls://1.1.1.1:853', 'https://doh.pub/dns-query'],
    "geosite:gfw": ["tls://1.1.1.1:853", "https://doh.pub/dns-query"],
    "geosite:cn": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"]
  }
  const originNameserverPolicy = config.dns['nameserver-policy'] || {};
  config.dns['nameserver-policy'] = { ...originNameserverPolicy, ...nameserverPolicy }

  const fallback = [
    "tls://1.1.1.1:853",
    "tls://1.0.0.1:853",
    "101.6.6.6:5353"
  ]
  const originFallback = config.dns['fallback'] || []
  config.dns['fallback'] = [...originFallback, ...fallback]

  const fakeIpFilter = [
    '+.apple.com',
  ]
  const originFakeIpFilter = config.dns['fake-ip-filter'] || []
  config.dns['fake-ip-filter'] = [...originFakeIpFilter, ...fakeIpFilter]

  if (!config.proxies) {
    return config;
  }
  const { selectGroup, autoSelectGroup } = findRegionProxyGroups(config);
  const allProxyGroup = findAllProxyGroup(config, autoSelectGroup)

  config['proxy-groups'] = [...allProxyGroup, ...selectGroup, ...autoSelectGroup]
  config['rules'] = []
  return config;
}

/**
 * 获取全部节点的代理组
 */
function findAllProxyGroup(config, proxyGroup) {
  const proxy_names = config.proxies.map(proxy => proxy.name);
  const addProxyGroup = (proxyGroup && proxyGroup.map(g => g.name)) || []
  const select_proxy_names = ["自动选择", ...addProxyGroup, ...proxy_names]
  const select = { name: "节点选择", type: "select", proxies: select_proxy_names }
  const url_test = { name: "自动选择", type: "url-test", proxies: proxy_names, url: 'http://www.gstatic.com/generate_204', interval: 86400 }
  const fallback = { name: "故障转移", type: "fallback", proxies: proxy_names, url: 'http://www.gstatic.com/generate_204', interval: 7200 }
  return [select, url_test, fallback]
}

/**
 * 获取地区节点的代理组
 * @param {number} [minProxyCount=5] 当组内节点小于这个值时都归为其他组
 */
function findRegionProxyGroups(config, minProxyCount = 5) {
  if (!config.proxies && !Array.isArray(config.proxies)) {
    return [];
  }
  const proxyGroups = config.proxies.map(proxy => proxy.name)
    .reduce((groups, item) => {
      //去除末尾和开头的数字和其他字符
      let groupName = item.replace(/(?:\d+|[\s-]+\d+|\s+[Vv]+\d+)$/g, '')
        .replace(/^(?:\d+[\s-]+|\d+|[Vv]+\d+\s+)/g, '');
      let proxyNames = groups[groupName] || [];
      groups[groupName] = [...proxyNames, item];
      return groups;
    }, {});
  const proxySelectGroup = [], proxyAutoSelectGroup = [], otherProxyNames = [];
  for (const key in proxyGroups) {
    const originProxyNames = proxyGroups[key];
    if (originProxyNames.length < minProxyCount) {
      otherProxyNames.push(...originProxyNames);
      continue
    }
    const { selectGroup, autoSelectGroup } = toGroupByProxyNames(key, originProxyNames);
    proxySelectGroup.push(selectGroup);
    proxyAutoSelectGroup.push(autoSelectGroup);
  }
  if (otherProxyNames && otherProxyNames.length > 0) {
    const { selectGroup, autoSelectGroup } = toGroupByProxyNames("其他地区", otherProxyNames);
    proxySelectGroup.push(selectGroup);
    proxyAutoSelectGroup.push(autoSelectGroup);
  }
  return { selectGroup: proxySelectGroup, autoSelectGroup: proxyAutoSelectGroup }
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
  const selectProxyName = [autoSelectGroupName, ...proxyNames]
  const selectGroup = { name: realGroupName, type: "select", proxies: selectProxyName }
  const autoSelectGroup = { name: autoSelectGroupName, type: "url-test", proxies: proxyNames, url: 'http://www.gstatic.com/generate_204', interval: 86400 }
  return { selectGroup, autoSelectGroup }
}