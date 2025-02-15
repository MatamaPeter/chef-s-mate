/* eslint-disable react/prop-types*/
import ReactMarkdown from 'react-markdown'
export default function Recipe(props) {
    return (
        props.recipe &&       
        <section className='suggested-recipe-container' aria-live='polite'>
            <h3>Chef&apos;s  Mate Recommends:</h3>
            <ReactMarkdown>{ props.recipe }</ReactMarkdown>
        </section>
        
        )
}