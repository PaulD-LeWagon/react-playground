import ErrorBoundary from "./ErrorBoundary.class"

import React, {
  // useRef,
  useState,
  // unstable_ViewTransition as ViewTransition,
  // unstable_addTransitionType as addTransitionType,
  // startTransition,
} from "react"

import logo from "./logo.svg"
import "./App.css"

import Tabs from "./page-components/Tabs"
// import Header from "./page-components/header"
import Page, {
  Header,
  Main,
  Section,
  Footer,
  Message,
  Modal,
  ImgCard,
  Card,
  Button,
} from "./page-components/components"

import { compact } from "./app-utilities"

const compactedArray = compact([1, null, 3, NaN, 5, undefined, 7, false])
console.log(compactedArray)

function App() {
  const [isActive, setIsActive] = useState(false)
  const onCloseClk = (event) => {
    setIsActive(!isActive)
  }
  const [isActive2, setIsActive2] = useState(false)
  const onCloseClk2 = (event) => {
    setIsActive2(!isActive2)
  }

  return (
    <div className="App">
      <ErrorBoundary
        fallback={
          <Message
            className="is-danger"
            title="Page Error:"
            description="Check console for more details"
            style={{ width: "400px", margin: "1rem auto" }}
          />
        }>
        <Page id="page_1">
          <Header
            level="1"
            title="My React Playground"
            subtitle="Exploring the React Eco-System"
            logoUrl={logo}
          />

          <Modal
            title="Test Modal"
            description="This is a test string for a test component. Testing 1, 2, 3"
            id="modal_1"
            classList="m-one m-two m-three"
            isActive={isActive}
            onCloseClk={onCloseClk}
          />

          <Modal
            title="Test Image Modal"
            description="This is a test string for a test component. Testing 1, 2, 3"
            id="modal_2"
            classList="m-one m-two m-three"
            isActive={isActive2}
            onCloseClk={onCloseClk2}
            atts={{
              src: "https://placehold.co/350x200/000000/FFF",
              alt: "Some image of something, somewhere!",
            }}
            type="image"
          />

          <Card
            id="card-1"
            classList="one"
            title="Lorem Ipsum"
            content="Vulpes velox fulva super canem pigrum saltavit!"
            footer={
              <Button
                classList="card-footer-item"
                atts={{
                  onClick: () => {
                    alert("Button Clicked!")
                  },
                }}>
                Click Me
              </Button>
            }
          />

          <ImgCard
            title="This is a placeholder image"
            content="The quick brown fox jumped over the lazy dog!"
            imgSrc="https://placehold.co/350x200/000000/FFF"
            imgAlt="Just a placholder image for now!"
            imgWidth="350px"
            imgHeight="200px"
          />

          <Main
            id="main-content"
            classList="slide-in"
            content={
              <Section
                id="app-tabs"
                content={
                  <Tabs
                    isActive={isActive}
                    onCloseClk={onCloseClk}
                    isActive2={isActive2}
                    onCloseClk2={onCloseClk2}
                  />
                }
              />
            }
          />

          <Footer
            id="page_footer"
            content={
              <>
                Devanney, Paul E. -{" "}
                <strong>
                  <em>la Digitál Rógue</em>
                </strong>{" "}
                &copy; 2025
              </>
            }
          />
        </Page>
      </ErrorBoundary>
    </div>
  )
}
export default App
