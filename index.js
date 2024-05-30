// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const CS_Writer = require('csv-writer').createObjectCsvWriter;
const path = require('path')

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");
  await page.waitForSelector('tr.athing')

  const articleItems = await page.$$eval('tr.athing', (articles) => {
    const items = []
    for (let article_row = 0; article_row < articles.length && article_row < 10; article_row++) {

      const article = articles[article_row]

      const article_title_ele = article.querySelector('td.title span.titleline > a')
      const article_title = article_title_ele.textContent
      const article_url = article_title_ele.getAttribute('href')

      const articleData = {
        title: article_title.trim(),
        url: article_url.trim()
      };

      items.push(articleData)
    }
    return items
  })

  const csWriter = CS_Writer({
    path: path.join(__dirname, 'hacker_news.csv'),
    header: [
      { id: 'title', title: 'Title' },
      { id: 'url', title: 'Url' }
    ]
  })

  await csWriter.writeRecords(articleItems)


  await browser.close()
}

(async () => {
  await saveHackerNewsArticles();
})();
