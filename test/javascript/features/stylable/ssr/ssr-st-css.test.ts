import Scripts from '../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'javascript',
});

describe.each(['dev', 'prod'] as const)('ssr-st-css [%s]', mode => {
  it('Should allow consuming *.st.css in server', async () => {
    await scripts[mode](async () => {
      await page.goto(scripts.serverUrl);
      const result = await page.$eval('#stylable-div', elm => elm.textContent);
      expect(result).toBe('Rendered with Stylable');
    });
  });
});
