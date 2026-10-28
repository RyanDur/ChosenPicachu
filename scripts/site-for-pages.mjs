import {copyFileSync, cpSync, rmSync} from 'node:fs';

const client = 'build/client';
// React Router writes pre-rendered pages under the basename, while Pages serves the site from the build's root
cpSync(`${client}/ChosenPicachu`, client, {recursive: true});
rmSync(`${client}/ChosenPicachu`, {recursive: true});
copyFileSync(`${client}/__spa-fallback.html`, `${client}/404.html`);
rmSync(`${client}/__spa-fallback.html`);
