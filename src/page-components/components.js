import { useRef, useState, createElement } from "react"
import "./components.css"

function tagBuilder(tagName, id, strClassList, objOtherAtts, content) {
  const atts = objOtherAtts || {}
  if (id && typeof id === "string") atts["id"] = id
  if (strClassList && typeof strClassList === "string")
    atts["className"] = strClassList
  return createElement(tagName, atts, content)
}

function Page({ id, classList, atts, content, children }) {
  return tagBuilder("div", id, classList, atts, content || children)
}
export default Page

function Main({ id, classList, atts, content, children }) {
  return tagBuilder("main", id, classList, atts, content || children)
}
export { Main }

function Article({ id, classList, atts, content, children }) {
  return tagBuilder("article", id, classList, content || children)
}
export { Article }

function Section({ id, classList, atts, content, children }) {
  return tagBuilder("section", id, classList, atts, content || children)
}
export { Section }

function Aside({ id, classList, atts, content, children }) {
  return tagBuilder("aside", id, classList, atts, content || children)
}
export { Aside }

function Footer({ id, classList, atts, content, children }) {
  return tagBuilder("footer", id, classList, atts, content || children)
}
export { Footer }

function Button({ id, classList, atts, content, children }) {
  return tagBuilder("button", id, classList, atts, content || children)
}
export { Button }

function Div({ id, classList, atts, content, children }) {
  return tagBuilder("div", id, classList, atts, content || children)
}
export { Div }

function Heading({ level, id, classList, atts, content, children }) {
  return tagBuilder(`h${level || 1}`, id, classList, atts, content || children)
}
export { Heading }

function Img({ id, classList, alt, src, width, height, atts = {} }) {
  atts = Object.assign(atts, {
    alt: alt,
    src: src,
    width: width,
    height: height,
  })
  return tagBuilder("img", id, classList, atts, null)
}
export { Img }

function Header({ level, title, subtitle, logoUrl, altText, rootClassName }) {
  if (level > 6 || level < 1) {
    console.error(`Error: heading level does not exist [${level}]`)
    return (
      <header className={rootClassName || "header-component"}>
        <Div className="dummy-placeholder" />
        <Heading
          level="3"
          className="error-message is-danger blink">
          Error: header level [{level}] for title [{title}] does not exist.
        </Heading>
      </header>
    )
  }
  return (
    <header className={rootClassName || "header-component"}>
      {logoUrl ? (
        <Img
          classList={`header-logo hl-h${level}`}
          altText={altText}
          srcUrl={logoUrl}
        />
      ) : (
        <Div className="dummy-placeholder" />
      )}
      <Div className="header-text-container">
        <Heading
          level={level}
          classList="header-title"
          content={title}
        />
        {subtitle ? (
          <Heading
            level={level < 6 ? Number(level) + 1 : level}
            classList="header-subtitle"
            content={subtitle}
          />
        ) : (
          " "
        )}
      </Div>
    </header>
  )
}
export { Header }

function Message({ id, classList, atts = {}, style = {}, title, description }) {
  const [doClose, setDoClose] = useState(false)
  const handleClick = (e) => {
    setDoClose(!doClose)
  }
  atts = Object.assign(atts, { style: style })
  return (
    <Div
      id={id}
      atts={atts}
      classList={`message ${classList || ""} ${doClose ? "hide" : "show"}`}>
      <Div classList="message-header">
        {title}{" "}
        <Button
          classList="delete"
          atts={{
            "aria-label": "delete",
            onClick: handleClick,
          }}
        />
      </Div>
      <Div
        classList="message-body"
        content={description}
      />
    </Div>
  )
}
export { Message }

// https://bulma.io/assets/images/placeholders/1280x960.png
function Modal({
  title,
  description,
  id,
  classList,
  atts = {},
  style = {},
  type = "card",
  isActive = false,
  onCloseClk = null,
}) {
  if (style) atts = Object.assign(atts, { style: style })
  return (
    <Div
      classList={`modal ${classList} ${isActive ? "is-active" : ""}`}
      atts={atts}>
      <Div classList="modal-background" />
      {type === "card" ? (
        <Div classList="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
            <Button
              classList="delete"
              atts={{
                "aria-label": "close",
                onClick: onCloseClk,
              }}
            />
          </header>
          <Section classList="modal-card-body">{description}</Section>
          <Footer classList="modal-card-foot">
            <p>
              And this is the <strong>Modal</strong> window's footer!
            </p>
          </Footer>
        </Div>
      ) : (
        <Div classList="modal-content">
          <p className="image is-4by3">
            <Img
              src={atts.src}
              alt={atts.alt}
            />
          </p>
        </Div>
      )}
      <Button
        classList="modal-close is-large"
        atts={{
          "aria-label": "close",
          onClick: onCloseClk,
        }}
      />
    </Div>
  )
}
export { Modal }

function Card({
  id,
  classList,
  atts = {},
  style = {},
  title,
  content,
  footer,
}) {
  return (
    <Div
      id={id || ""}
      classList={`card ${classList || ""}`.trim()}
      atts={Object.assign(atts, style)}>
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>

      {content ? (
        <Section classList="card-content">
          <Div classList="content">{content}</Div>
        </Section>
      ) : (
        ""
      )}

      {footer ? <Footer classList="card-footer">{footer}</Footer> : ""}
    </Div>
  )
}
export { Card }

function ImgCard({
  id,
  classList,
  atts = {},
  style = {},
  title,
  content,
  footer,
  imgSrc,
  imgAlt,
  imgWidth,
  imgHeight,
}) {
  return (
    <Div
      id={id || ""}
      classList={`card ${classList || ""}`.trim()}
      atts={Object.assign(atts, style)}>
      <Div classList="card-image">
        <figure class="image is-4by3">
          <Img
            src={imgSrc}
            alt={imgAlt}
            atts={{
              width: imgWidth,
              height: imgHeight,
            }}
          />
          <figcaption>{title}</figcaption>
        </figure>
      </Div>

      {content ? (
        <Section classList="card-content">
          <Div classList="content">{content}</Div>
        </Section>
      ) : (
        ""
      )}

      {footer ? <Footer classList="card-footer">{footer}</Footer> : ""}
    </Div>
  )
}
export { ImgCard }

function HeroBanner({
  id,
  classList,
  atts = {},
  style = {},
  title,
  subtitle,
  ctaBtn,
  bgImgSrc,
  logoImgSrc,
}) {
  return <Div />
}
export { HeroBanner }
