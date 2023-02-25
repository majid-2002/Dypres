import React from 'react'

function HomePage() {
    return (
        <>
            <div className="h-screen" style={{ background: "linear-gradient(to top left, rgb(175, 255, 230), rgb(134, 186, 255))" }}>
                <div
                    id="hero"
                    className="bg-curvy-light-mode h-full  flex items-center justify-center"
                >
                    <div className="container mx-auto px-6 text-center  flex-col items-center justify-center">
                        {/* <img src="images/illustration-intro.png" alt="" className="mx-auto" /> */}
                        <h1 className="max-w-2xl mx-auto mb-10  font-bold leading-normal md:text-9xl uppercase">
                            D Y P R E S
                        </h1>
                        <p className="max-w-sm mx-auto mb-10 text-sm md:max-w-5xl md:text-5xl md: font-semibold leading-relaxed">
                            Dynamic Presentation using NLP & AI
                        </p>
                        <button onClick={() => window.location.href = "/Playground"} className="p-3 rounded-full w-80  h-16 bg-accentCyan bg-gradient-to-r from-orange-400 to-rose-400 text-white font-semibold text-3xl">
                            Start presenting
                        </button>
                    </div>
                </div>


            </div>

        </>

    )
}

export default HomePage