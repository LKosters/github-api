import puppeteer from 'puppeteer';

export default defineEventHandler(async (event) => {
    const user = getRouterParam(event, 'user');

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const url = `https://github.com/${user}?page=1&tab=repositories`;

        await page.goto(url, { waitUntil: 'networkidle2' });

        const repositories = await page.evaluate(() => {
            const liElements = document.querySelectorAll('#user-repositories-list ul > li');

            return Array.from(liElements).map(li => {
                const h3Link = li.querySelector('h3 a');
                const href = h3Link ? h3Link.href : null;
                const title = h3Link ? h3Link.innerText.trim() : 'No title';

                const programmingLanguage = li.querySelector('[itemprop="programmingLanguage"]');
                const language = programmingLanguage ? programmingLanguage.innerText.trim() : 'No language specified';

                return {
                    title,
                    href,
                    language
                };
            });
        });

        await browser.close();

        return {
            success: true,
            repositories
        };
    } catch (error) {
        console.error('Error scraping the page:', error);
        return {
            success: false,
            message: 'Failed to scrape the page.',
            error: error.message
        };
    }
})
