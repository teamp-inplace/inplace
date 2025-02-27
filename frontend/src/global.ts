import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	@font-face {
		font-family: "Noto Sans";
		font-weight: 700;
		src: url("./assets/fonts/noto-sans-v38-latin-700.woff2") format("font-woff2"),
		url("./assets/fonts/Noto-Sans-700.woff") format("font-woff"),;
		font-display: swap;
	}

	@font-face {
		font-family: "Noto Sans";
		font-weight: 400;
		src: url("./assets/fonts/noto-sans-v38-latin-regular.woff2") format("font-woff2"),
		url("./assets/fonts/Noto-Sans-regular.woff") format("font-woff"),;
		font-display: swap;
	}

	html {
		background-color: ${(props) => props.theme.backgroundColor};
	}
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	vertical-align: baseline;
	text-decoration: none;
}
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
	font-family: 'Noto Sans', sans-serif;
	color: ${(props) => props.theme.textColor} !important;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
`;
export default GlobalStyle;
