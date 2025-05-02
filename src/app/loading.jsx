"use client";

import React from "react";

const loading = () => {
    return (
        <div className="loading-container">
            <div className="cube">
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
                <div className="side"></div>
            </div>

            <style jsx>{`
                .loading-container {
                    display: flex;
                    height: 100vh;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 999;
                }

                .cube {
                    margin: auto;
                    font-size: 24px;
                    height: 1em;
                    width: 1em;
                    position: relative;
                    transform: rotatex(30deg) rotatey(45deg);
                    transform-style: preserve-3d;
                    animation: cube-spin 1.5s infinite ease-in-out alternate;
                    color: #3b82f6; /* Matching the blue theme */
                }

                .side {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    transform-style: preserve-3d;
                }
                .side::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: currentcolor;
                    transform: translatez(0.5em);
                    animation: cube-explode 1.5s infinite ease-in-out;
                    opacity: 0.5;
                }

                .side:nth-child(1) {
                    transform: rotatey(90deg);
                }
                .side:nth-child(2) {
                    transform: rotatey(180deg);
                }
                .side:nth-child(3) {
                    transform: rotatey(270deg);
                }
                .side:nth-child(4) {
                    transform: rotatey(360deg);
                }
                .side:nth-child(5) {
                    transform: rotatex(90deg);
                }
                .side:nth-child(6) {
                    transform: rotatex(270deg);
                }

                @keyframes cube-spin {
                    0% {
                        transform: rotatex(30deg) rotatey(45deg);
                    }
                    100% {
                        transform: rotatex(30deg) rotatey(405deg);
                    }
                }

                @keyframes cube-explode {
                    0% {
                        transform: translatez(0.5em);
                    }
                    50% {
                        transform: translatez(0.75em);
                    }
                    100% {
                        transform: translatez(0.5em);
                    }
                }
            `}</style>
        </div>
    );
};

export default loading;
