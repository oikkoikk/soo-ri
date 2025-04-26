/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react'
import '../fonts/fonts.css'

export function GlobalStyle() {
  return (
    <Global
      styles={css`
        /* RESET */
        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          font-family:
            'Pretendard Variable',
            Pretendard,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            'Helvetica Neue',
            sans-serif;
          background-color: #ffffff;
          color: #000000;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          color: inherit;
          cursor: pointer;
        }

        ul,
        ol {
          list-style: none;
        }

        img {
          max-width: 100%;
          display: block;
        }
      `}
    />
  )
}
