import "./App.css";
import FeatherIcon from "feather-icons-react";
import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";
import axios from "axios";
import PlayGround from "./pages/PlayGround";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// react icons
import { CiTextAlignJustify } from "react-icons/ci";
import { IoIosImages } from "react-icons/io";
import { Feather } from "feather-icons-react/build/IconComponents";

function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [image, setImage] = useState();
  const [data, setData] = useState();
  const [preview, setPreview] = useState(0);
  const [wiki, setWiki] = useState();

  const [recording, setRecording] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const getTitle = (keywords) => {
    const config = {
      method: "POST",
      url: "https://api.openai.com/v1/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      data: {
        model: "text-davinci-002",
        prompt: "what is this talking about? " + keywords.join(" "),
        max_tokens: 10,
        temperature: 0,
      },
    };

    axios(config).then((response) => {
      fetchImage(response.data?.choices[0]?.text);
      setTitle(response.data?.choices[0]?.text);
    });
  };

  const getDescription = (keywords) => {
    const config = {
      method: "POST",
      url: "https://api.openai.com/v1/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      data: {
        model: "text-davinci-002",
        prompt: "describe: " + keywords.join(" "),
        max_tokens: 100,
        temperature: 0,
      },
    };

    axios(config).then((response) => {
      setDescription(response.data?.choices[0]?.text);
    });
  };

  const fetchWiki = (title) => {
    console.log("titktktktgmrtgtrgtr: ", title);
    const config = {
      method: "GET",
      url: `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${title?.replaceAll(
        " ",
        "%20"
      )}`,
    };

    axios(config).then((response) => {
      setWiki(response.data);
    });
  };

  const fetchData = (query) => {
    if (!query) return;
    const config = {
      method: "GET",
      url: `https://serpapi.com/search?q=${query?.join(
        "+"
      )}&api_key=58d5c347cf8669cfd588939f3b95299a3afd3c183d3da77e6e977876e3f6475b`,
    };

    axios(config).then((response) => {
      setData(response.data);
      fetchWiki(response.data?.organic_results[0]?.title.split(" -")[0]);
      for (const id of timerIds) {
        clearTimeout(id);
      }
    });
  };

  const fetchImage = (query) => {
    const keywords = keyword_extractor.extract(query, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });
    const config = {
      method: "GET",
      url: "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI",
      params: {
        q: keywords.join(" "),
        pageNumber: "1",
        pageSize: "10",
        autoCorrect: "true",
      },
      headers: {
        "X-RapidAPI-Key": "f7c80ccd95msh891c62f154aef5dp190567jsn9ab3b01f12cb",
        "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
      },
    };

    axios(config).then((response) => {
      setImage(response.data);
      for (const id of timerIds) {
        clearTimeout(id);
      }
    });
  };

  const [captions, setCaptions] = useState("");
  // AIzaSyDMuaqfXL51E30BkijmiZCX-S8FFjBHRvY

  const processData = (keywords) => {
    getTitle(keywords);
    getDescription(keywords);
    resetTranscript();
  };

  const [timerIds, setTimerIds] = useState([]);
  useEffect(() => {
    for (const id of timerIds) {
      clearTimeout(id);
    }

    const keywords = keyword_extractor.extract(transcript, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });

    const timer = () =>
      setTimeout(() => {
        if (keywords.length > 1) {
          processData(keywords);
        }
      }, 2500);
    const timerId = timer();
    timerIds.push(timerId);
    setTimerIds([...timerIds]);
  }, [transcript]);

  useEffect(() => {
    var Filter = require("bad-words");
    var filter = new Filter();

    if (transcript) {
      setCaptions(filter.clean(transcript.toLowerCase()));
    }

    const keywords = keyword_extractor.extract(transcript, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });

    if (keywords.length > 7) {
      processData(keywords);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const keyword_extractor = require("keyword-extractor");

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route
            exact
            path="/PlayGround"
            element={
              <>
                {" "}
                <div className="App">
                  <div
                    className="column"
                    style={{
                      height: "100%",
                      padding: "5px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="row justify-space-between align-center"
                      style={{
                        width: "100%",
                        padding: "0 5vw",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="column">
                        <h1
                          style={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            letterSpacing: "10px",
                          }}
                        >
                          DYPRES
                        </h1>
                        <p style={{ fontWeight: "bold", opacity: "0.5" }}>
                          by BIT LORDS
                        </p>
                      </div>
                      <div className="row preview_btn_container mt-8">
                        <div
                          className={
                            "preview_btn  flex text-7xl " +
                            (preview === 0 ? "enabled_btn" : "")
                          }
                          onClick={() => setPreview(0)}
                        >
                          <FeatherIcon icon={"image"} />
                          <FeatherIcon icon={"align-justify"} />
                        </div>
                        <div
                          className={
                            "preview_btn flex text-7xl " +
                            (preview === 1 ? "enabled_btn" : "")
                          }
                          onClick={() => setPreview(1)}
                        >
                          <FeatherIcon icon={"align-justify"} />
                          <FeatherIcon icon={"image"} />
                        </div>
                      </div>
                      <div className="refresh_btn" onClick={()=>{
                        window.location.reload();
                      }}>
                        <FeatherIcon id="icon" icon={"refresh-cw"}/>
                      </div>
                    </div>
                    <div
                      className={"preview " + ["row", "row-reverse"][preview]}
                    >
                      <div className={"column "}>
                        <img src={image?.value[0]?.url} />
                        <img src={image?.value[1]?.url} />
                      </div>
                      <div
                        className={"column"}
                        style={{ margin: "0 20px", justifyContent: "center" }}
                      >
                        <p
                          style={{
                            color: "black",
                            fontSize: "3rem",
                            fontWeight: "bold",
                          }}
                        >
                          {data?.organic_results[0]?.title?.split(" -")[0]}{title.replaceAll("about the", "").replaceAll("This is talking", "").replaceAll("about", "")}
                        </p>
                        <div>
                          <p
                            style={{
                              color: "black",
                              textAlign: "justify",
                              fontSize: "2rem",
                              lineHeight: "60px",
                              marginTop: "20px",
                            }}
                          >
                            {wiki?.query?.pages[
                              Object.keys(wiki?.query?.pages)[0]
                            ]?.extract
                              ? wiki?.query?.pages[
                                  Object.keys(wiki?.query?.pages)[0]
                                ]?.extract
                                  ?.split(".")
                                  ?.slice(0, 3)
                                  ?.join(" ")
                              : data?.organic_results
                              ? data?.organic_results[0]?.snippet
                              : ""}{description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row justify-space-between align-center"
                      style={{ width: "100%", padding: "0 30px" }}
                    >
                      <p className="caption_text">{transcript}</p>
                      <div
                        className={
                          "mic_btn_ripple " + (listening ? "ripple_anim" : "")
                        }
                        onClick={() => {
                          if (!listening) {
                            SpeechRecognition.startListening({
                              continuous: true,
                            });
                          } else {
                            SpeechRecognition.stopListening();
                          }
                        }}
                      >
                        <div
                          className={
                            "mic_btn " + (!listening ? "red_shadow" : "")
                          }
                          style={{
                            background: !listening ? "rgb(181, 67, 67)" : null,
                          }}
                        >
                          <FeatherIcon
                            id="icon"
                            icon={listening ? "mic" : "mic-off"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
