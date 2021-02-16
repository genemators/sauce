/* Copyright 2020 Genemator Sakhib. All rights reserved. MPL-2.0 license. */

/* Copyright 2020 Genemator Sakhib. All rights reserved. MPL-2.0 license. */

import React from "react";
import Head from "next/head";
import { GetStaticProps } from "next/types";

import { promises } from "fs";

const IndexPage = (props: any): React.ReactElement => {
  return (
    <>
      <Head>
        <title>CDN | Genemator's</title>
        <meta property="og:title" content="Page where you can list CDN files" />
        <meta
          property="og:description"
          content="At this page you can list existing files in our website!"
        />
      </Head>
      <div className="pt-8 pb-20 px-4 sm:px-6 lg:pt-8 lg:pb-28 lg:px-8">
        <div className="max-w-screen-lg mx-auto">
          <div className="border-b-2 border-gray-100 pb-10">
            <h2 className="text-4xl font-bold tracking-tight">
              CDN {"<|>"} Media Management
            </h2>
            <div className="mt-3 sm:mt-4">
              <p className="text-xl leading-7 text-white">
                Browse all public files that was hosted by this website
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-16 lg:grid-cols-2 lg:col-gap-5 lg:row-gap-12">
            {props.dir.map((content: any) => {
              return (
                <div key={content}>
                  <a
                    href={"https://sauce.genemator.me/" + content}
                    className="block"
                  >
                    <h3 className="mt-2 text-xl leading-7 font-semibold text-white">
                      {content}
                    </h3>
                    <p className="mt-3 text-base leading-6 text-gray-300">
                      Press the button below to open it!
                    </p>
                  </a>
                  <div className="mt-3">
                    <a
                      href={"https://sauce.genemator.me/" + content}
                      className="read-post text-base leading-6 font-semibold transition ease-in-out duration-150"
                    >
                      Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const dir = await promises.readdir("./public");
  return {
    props: { dir },
  };
};

export default IndexPage;
