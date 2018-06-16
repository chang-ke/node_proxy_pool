const request = require('request-promise'),
  cheerio = require('cheerio'),
  ua = require('random-ua');
const { flatten, sleep } = require('./utils');

const generateOpts = uri => ({
  headers: { 'User-Agent': ua.generate() },
  uri,
  transform: body => cheerio.load(body)
});

let fnList = {
  /**
   * http://ip.jiangxianli.com
   *
   * @returns portPool
   */
  firstFreePort: async function() {
    let _portPool = [];
    for (let i = 1; i < 20; ++i) {
      let opts = generateOpts(`http://ip.jiangxianli.com/?page=${i}`);
      let $ = await request(opts);
      for (let j = 0; j < $('.table tbody tr').length; ++j) {
        let td = $('.table tbody tr')
          .eq(j)
          .find('td');
        _portPool.push({
          ip: td.eq(1).text(),
          port: td.eq(2).text()
        });
      }
    }
    return _portPool;
  },
  /**
   * 无忧代理 http://www.data5u.com/
   *
   * @returns portPool
   */
  secondFreePort: async function() {
    let _portPool = [];
    let urlList = [
      'http://www.data5u.com/',
      'http://www.data5u.com/free/gngn/index.shtml',
      'http://www.data5u.com/free/gnpt/index.shtml'
    ];
    for (url of urlList) {
      let opts = generateOpts(url);
      let $ = await request(opts);
      for (let i = 0; i < $('.l2').length; ++i) {
        let li = $('.l2')
          .eq(i)
          .find('li');
        _portPool.push({
          ip: li.eq(0).text(),
          port: li.eq(1).text()
        });
      }
    }
    return _portPool;
  },
  /**
   * http://www.66ip.cn/
   *
   * @param {number} [area=33] 抓取代理页数，page=1北京代理页，page=2上海代理页......
   * @param {number} [page=1] 翻页
   * @returns portPool
   */
  thirdFreePort: async function(area = 34, page = 1) {
    let _portPool = [];
    for (let i = 1; i <= area; ++i) {
      for (let k = 1; k <= page; ++k) {
        let opts = generateOpts(`http://www.66ip.cn/areaindex_${i}/${k}.html`);
        let $ = await request(opts);
        let tr = $('#footer tr');
        for (let i = 1; i < tr.length; ++i) {
          let td = tr.eq(i).find('td');
          _portPool.push({
            ip: td.eq(0).text(),
            port: td.eq(1).text()
          });
        }
      }
    }
    return _portPool;
  },
  /**
   * http://www.ip181.com/
   *
   * @returns portPool
   */
  fourthFreePort: async function() {
    let _portPool = [];
    let opts = generateOpts('http://www.ip181.com/');
    let $ = await request(opts);
    let data = JSON.parse(
      $('body')
        .eq(0)
        .text()
    );
    if (data.ERRORCODE == 0) {
      for (next of data.RESULT) {
        _portPool.push({
          ip: next.ip,
          port: next.port
        });
      }
      return _portPool;
    } else {
      return [];
    }
  },
  /**
   * 西刺代理 http://www.xicidaili.com
   *
   * @returns portPool
   */
  fifthFreePort: async function(pageCount = 2) {
    let _portPool = [];
    let urlList = ['http://www.xicidaili.com/nn/' /* 高匿*/, 'http://www.xicidaili.com/nt/' /* 透明*/];
    for (url of urlList) {
      for (let count = 1; count < pageCount; ++count) {
        let opts = generateOpts(`${url}${count}`);
        let $ = await request(opts);
        let tr = $('#ip_list tr');
        for (let i = 1; i < tr.length; ++i) {
          let td = tr.eq(i).find('td');
          _portPool.push({
            ip: td.eq(1).text(),
            port: td.eq(2).text()
          });
        }
      }
    }
    return _portPool;
  },
  /**
   * 全网代理 http://www.goubanjia.com/
   *
   * @returns portPool
   */
  sixthFreePort: async function() {
    let _portPool = [];
    return _portPool;
  }
};

async function getAll() {
  try {
    let portPoolList = await Promise.all(Object.keys(fnList).map(fn => fnList[fn]()));
    return flatten(portPoolList);
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { fnList, getAll };
