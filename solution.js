'use strict'

const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

const url = 'https://www.bankmega.com/promo_detail.php?id=926'

const htmlDecode = text => {
  return text.replace(/\s+/g, ' ').trim()
}

request(url, (err, res, body) => {
  if (err && res.statusCode !== 200) throw err

  let $ = cheerio.load(body)
  let promo = {
    category: [],
  }

  fs.readFile('./solution.json', 'utf8', (err, data) => {
    if (err) throw err

    promo = JSON.parse(data)
    promo.category.push({
      title: htmlDecode($('.titleinside').text()) || null,
      area: htmlDecode($('.area').text()) || null,
      periode: htmlDecode($('.periode').text()) || null,
      imgUrl:
        $('.keteranganinside')
          .find('img')
          .attr('src') || null,
    })

    let json = JSON.stringify(promo)
    fs.writeFile('./solution.json', json, 'utf8', err => {
      if (err) throw err
    })
  })
})
