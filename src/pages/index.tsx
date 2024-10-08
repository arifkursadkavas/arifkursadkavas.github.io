import React from 'react';
import 'isomorphic-unfetch';
import Tag from '../components/Tag';
import Head from 'next/head';

const Index = () => {
    return (
            <div className='aboutContainer'>
            <Head>
				<meta name='description' content='Arif Kürsad Kavas' />
				<meta property='og:title' content='Arif Kürsad Kavas' />
			</Head>
                Hi!
                <br/><br/> <span>I am a fullstack software developer with a professional experience for over 20 years using various programming languages and 
                frontend technologies.</span>
                <br/>
                {true && <a href='mailTo:arifkavas@gmail.com'> Contact me</a>}
                <br /><br />
                <p>Skills(Experienced and currently utilized)</p>
                Backend
                <div className='tagList'>
                    {['C', 'C++', 'Go', 'C#', 'Java', 'PHP', 'NodeJs'].map((t) => (<Tag text={t} key={t}></Tag>))}
                </div>
                <br />
                Frontend
                <div className='tagList'>
                    {[
                        'ReactJs',
                        'Redux',
                        'Jest',
                        'Angular10+',
                        'VanillaJs',
                        'NextJs',
                        'Scss',
                        'GraphQL',
                        'Typescript',
                        'Micro-Frontends'
                    ].map((t) => (
                        <Tag text={t} key={t}></Tag>
                    ))}
                </div>
                <br />
        OS
        <div className='tagList'>
                    {['Linux', 'Solaris'].map((t) => (
                        <Tag text={t} key={t}></Tag>
                    ))}
                </div>
                <br />
        Database
        <div className='tagList'>
                    {' '}
                    {['Mysql', 'PostgreSql', 'Oracle', 'Mongo', 'DGraph'].map((t) => (
                        <Tag text={t} key={t}></Tag>
                    ))}
                </div>
            </div>
    )
}

export default Index