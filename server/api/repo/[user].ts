import { load } from 'cheerio';

export default defineEventHandler(async (event) => {
    const user = getRouterParam(event, 'user');

    const site = await $fetch<string>(`https://github.com/${user}?page=1&tab=repositories`);

    const $ = load(site);

    const repos = $('#user-repositories-list ul > li').map((index, element) => {
        const title = $(element).find('h3 a').text().trim();
        const href = $(element).find('h3 a').attr('href');
        const language = $(element).find('[itemprop="programmingLanguage"]').text().trim();
        const description = $(element).find('[itemprop="description"]').text().trim();

        return {
            title,
            href: `https://github.com${href}`,
            language: language || 'Not specified',
            description: description
        };
    }).get();

    return {
        success: true,
        repositories: repos,
    };
});