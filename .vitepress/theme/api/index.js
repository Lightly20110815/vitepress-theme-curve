/**
 * 获取一言
 * @param {string} [rule="updated"] - 文章的排序规则，可以是 "created" 或 "updated"
 */
let useFallbackAPI = false; // 跟踪是否使用备用 API

export const getHitokoto = async () => {
  const primaryUrl = "https://v1.hitokoto.cn/";
  const fallbackUrl = "https://international.v1.hitokoto.cn/";

  try {
    // 如果已切换到备用 API，直接使用备用 API
    const url = useFallbackAPI ? fallbackUrl : primaryUrl;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const hitokoto = await response.json();
    // 源代码如下：
    // 更改时间：2025.06.11
    // 变更功能：延迟一言在后2秒再显示，留给用户时间查看slogan
    return hitokoto;
    // 返回一个新的 Promise，它将在2秒后解析
    //return new Promise(resolve => {
    //  setTimeout(() => {
    //    resolve(hitokoto);
    //  }, 2000); // 2000 毫秒 = 2 秒
    //});
  } catch (error) {
    console.error(`获取一言失败 (${useFallbackAPI ? '备用 API' : '主 API'})：`, error);
    if (!useFallbackAPI) {
      // 主 API 失败，切换到备用 API
      useFallbackAPI = true;
      // 递归调用以使用备用 API
      return await getHitokoto();
    }
    // 备用 API 也失败，抛出错误
    throw error;
  }
};

/**
 * 获取给定网址的站点图标和描述
 * @param {string} url - 站点 URL
 * @returns {Promise<{iconUrl: string, description: string}>}
 */
export const getSiteInfo = async (url) => {
  const details = {
    iconUrl: null,
    title: null,
    description: null,
  };
  try {
    // 站点数据
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    // 获取页面标题
    const titleElement = doc.querySelector("title");
    details.title = titleElement ? titleElement.textContent : "暂无标题";
    // 获取 icon
    let iconLink =
      doc.querySelector("link[rel='shortcut icon']") || doc.querySelector("link[rel='icon']");
    if (iconLink) {
      details.iconUrl = new URL(iconLink.getAttribute("href"), url).href;
    } else {
      details.iconUrl = new URL("/favicon.ico", url).href;
    }
    // 获取描述
    const metaDescription = doc.querySelector("meta[name='description']");
    details.description = metaDescription ? metaDescription.content : "暂无站点描述";
  } catch (error) {
    console.error("获取站点信息失败：", error);
  }
  return details;
};

/**
 * Meting
 * @param {id} string - 歌曲ID
 * @param {server} string - 服务器
 * @param {type} string - 类型
 * @returns {Promise<Object>} - 音乐详情
 */
export const getMusicList = async (url, id, server = "netease", type = "playlist") => {
  const result = await fetch(`${url}?server=${server}&type=${type}&id=${id}`);
  const list = await result.json();
  return list.map((song) => {
    const { pic, ...data } = song;
    return {
      ...data,
      cover: pic,
    };
  });
};

/**
 * 站点统计数据
 */
export const getStatistics = async (key) => {
  const result = await fetch(`https://v6-widget.51.la/v6/${key}/quote.js`);
  const title = [
    "最近活跃",
    "今日人数",
    "今日访问",
    "昨日人数",
    "昨日访问",
    "本月访问",
    "总访问量",
  ];
  const data = await result.text();
  let num = data.match(/(<\/span><span>).*?(\/span><\/p>)/g);
  num = num.map((el) => {
    const val = el.replace(/(<\/span><span>)/g, "");
    return val.replace(/(<\/span><\/p>)/g, "");
  });
  const statistics = {};
  for (let i = 0; i < num.length; i++) {
    if (i === num.length - 1) continue;
    statistics[title[i]] = num[i];
  }
  return statistics;
};


/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
  const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
  return await res.json();
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
  const res = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  );
  return await res.json();
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
// export const getOtherWeather = async () => {
//  const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
//  return await res.json();
// };
