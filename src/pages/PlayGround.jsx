
import FeatherIcon from "feather-icons-react"

import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition"
import { useEffect, useState } from "react"
import axios from "axios"

//react icons
import { BsFillMicFill } from 'react-icons/bs'

function PlayGround() {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition()

    useEffect(() => {
        SpeechRecognition.startListening({ continuous: true })
    }, [])

    const [image, setImage] = useState()
    const [data, setData] = useState()

    const [wiki, setWiki] = useState()

    const fetchWiki = (title) => {
        console.log("titktktktgmrtgtrgtr: ", title)
        const config = {
            method: "GET",
            url: `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${title?.replaceAll(
                " ",
                "%20"
            )}`,
        }

        axios(config).then((response) => {
            setWiki(response.data)
        })
    }

    const fetchData = (query) => {
        const config = {
            method: "GET",
            url: `https://serpapi.com/search?q=${query.join(
                "+"
            )}&api_key=355dd42adb221cbcb8c5d3566dce65da68028c80d7229639453db05f75c892c5`,
        }

        axios(config).then((response) => {
            setData(response.data)
            fetchWiki(response.data?.organic_results[0]?.title.split(" -")[0])
        })
    }

    const fetchImage = (query) => {
        const config = {
            method: "GET",
            url: "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI",
            params: {
                q: query,
                pageNumber: "1",
                pageSize: "10",
                autoCorrect: "true",
            },
            headers: {
                'X-RapidAPI-Key': '92266e1477msh8ffb2bbafb3a4f1p167c93jsncce5a0dc71a6',
                'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
            },
        }

        axios(config).then((response) => {
            setImage(response.data)
        })
    }

    const [captions, setCaptions] = useState("")
    // AIzaSyDMuaqfXL51E30BkijmiZCX-S8FFjBHRvY

    useEffect(() => {
        var Filter = require("bad-words")
        var filter = new Filter()

        if (transcript) {
            setCaptions(filter.clean(transcript.toLowerCase()))
        }

        const keywords = keyword_extractor.extract(transcript, {
            language: "english",
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: false,
        })

        if (keywords.length > 4) {
            fetchImage(keywords.join(" "))
            fetchData(keywords)
            resetTranscript()
        }
    }, [transcript])

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>
    }

    const keyword_extractor = require("keyword-extractor")

    return (
        <div className="h-screen box-border">
            <div className="h-5/6 p-3" >
                <div className="preview flex flex-col">
                    {/* text */}
                    <div className="overflow-visible">

                        {/* title */}
                        <p className="text-4xl text-center font-bold"
                            style={{
                                color:
                                    "#" +
                                    ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),


                            }}
                        >
                            {data?.organic_results[0]?.title?.split(" -")[0]}
                        </p>
                        <div className="p-6">

                            {/* text check if wiki data is available */}
                            {wiki?.query?.pages[Object.keys(wiki?.query?.pages)[0]]?.extract ?

                                // wiki  text display
                                wiki?.query?.pages[Object.keys(wiki?.query?.pages)[0]]?.extract
                                    ?.split(".")
                                    ?.slice(0, 5)
                                    ?.map((item) => {
                                        return (
                                            <p
                                                style={{
                                                    color: "black",
                                                    textAlign: "center",

                                                }}
                                            >
                                                {item}
                                            </p>
                                        )
                                    }) : <div >
                                    <p className="text-2xl font-bold"
                                        style={{
                                            color: "black",
                                            textAlign: "center",

                                        }}
                                    >
                                        {data?.organic_results ? data?.organic_results[0]?.snippet : ""}
                                    </p>
                                </div>}
                        </div>
                    </div>
                    {/* Images  */}
                    <div className=" flex overflow-hidden ">
                        {image?.value[0] && <img className="box-border" src={image?.value[0]?.url} alt="" />}
                        {image?.value[1] && <img src={image?.value[1]?.url} alt="" />}
                    </div>




                </div>
                <div className="row justify-space-between">
                    <p>{transcript}</p>
                    <div>
                        <BsFillMicFill />
                        { }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayGround