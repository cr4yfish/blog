import Header from '../../components/Header';
import BackgroundImage from '../../components/cards/BackgroundImage';
import SpotlightSection from '../../components/sections/SpotlightSection';
import CardSection from '../../components/sections/CardSection';
import articleStyle from '../../styles/articleView.module.css';
import Meta from '../../components/cards/Meta';
import Tags from '../../components/cards/Tags';
import Link from "next/link";
import SpinnerButton from "../../components/SpinnerButton";

const saveDataInLocalStorage = (data) => {
    if(typeof window !== 'undefined') {
      // refresh data in localStorage
      localStorage.removeItem("data");
      localStorage.setItem('data', JSON.stringify(data))
    }
}

const CategoryView = ({ data, category }) => {

    // return backgroundImage component with random article from data
    const randomArticle = () => {
        const article = data[0];
        return (
            <>
            <BackgroundImage userImg={true} className="featuredBG " image={article.mainImage} spotlight={false} slug={article.slug.current} postLink={false} />
            <div className='featuredMeta'>
                <Meta article={article} />
                <h1>{article.title}</h1>
                <Tags tags={article.tags} full={false} />
                <p>{article.subtitle}</p>
                <Link href={`/post/${article.slug.current}`} >
                <a>
                    <SpinnerButton text="Read more" />
                </a>
                </Link>
            </div>
            </>
        )
    }

    try {
    return (
        <div id="articleView">
            <Header title={`${category.title} | Closed[in]`} />
            <main>
                <div id='content_wrapper' style={{marginTop:0}}> 
                <div className='categoryHeader' >
                    <h1>{category.title}</h1>
                </div>
                    {randomArticle()}
                    <CardSection data={data} overwrite={`Latest in ${category.title}`} />
                    <SpotlightSection className={articleStyle.article_spotlight} data={data} forward={false} />
                </div>
            </main>
        </div>  )
    } catch(e) {
        return {
            redirect: {
                destination: "/500",
                permanent: false
            },
        }
    }
}

import client from "../../components/SanityClient";

export async function getStaticPaths() {
    let data = await client.fetch(`*[_type == "category"]{
      ...,
    }`) 
  
    const paths = data.map(category => ({
      params: { category: category.title },
    }))
  
    return { paths, fallback: false }
  }

export async function getStaticProps({ params }) {
    let data = false;

    // single article for article view
    let category = params.category;

    // get data from sanity
    const searchStr = `*[_type == "category" && title=="${category}"] {
        _id,
        ...,
        "posts": *[_type=="post" && category._ref == ^._id] {
          ...,
          category->,
          author->
        }
    }`
    data = await client.fetch(searchStr);
    data = data[0];
    category = data;
    data = data.posts;
    
  return { props: { data, category }};
}

export default CategoryView;