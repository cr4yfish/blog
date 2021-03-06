import Link from 'next/link'
import BackgroundImage from './BackgroundImage';
import Tags from "./Tags";
import Meta from "./Meta";
import { useState } from "react";
import { css } from "@emotion/react";
import PuffLoader from "react-spinners/PuffLoader";

export default function Card({article}) {
    const [loading, setLoading] = useState(false);

    const override = css`
        width: 160px;
        height: 160px;
    `;

    // check if loading is true
    // if so, render spinner, else render content
    const renderContent = loading ? (
        <div className="spinner">
            <PuffLoader
                size={150}
                color={"#F8CD86"}
                loading={loading}
                css={override}
            />
        </div>
    ) : (
        <>
        <div>
            <span className="spotlightTitle articleCardTitle vollkorn">{article.title}</span>
            <Tags tags={article.tags} full={false} />
            <div className="subtitle roboto roboto-light">{article.subtitle}</div>
        </div>
        <div>
            <Meta article={article} />
        </div>
        </>
    )

    return (
        <BackgroundImage 
            onclick={() => setLoading(true)} 
            className="spotlightSlide articleCard" image={article.mainImage} 
            spotlight={true} slug={article.slug.current} 
            >
            {renderContent}
        </BackgroundImage>
    )
}