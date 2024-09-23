import { load } from 'cheerio';

export default defineEventHandler(async (event) => {
    const user = getRouterParam(event, 'user');
    const repo = getRouterParam(event, 'repo');

    const site = await $fetch<string>(`https://github.com/${user}/${repo}/blob/main/README.md?plain=1`);

    const $ = load(site);

    const details = $('body #highlighted-line-menu-positioner').map((index, element) => {
        const readme = $(element).find('#read-only-cursor-text-area').text().trim();

        return {
            readme,
        };
    }).get();

    return {
        success: true,
        readme: details,
    };
});