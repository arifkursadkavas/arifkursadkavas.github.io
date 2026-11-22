import React from 'react';
import 'isomorphic-unfetch';
import Tag from '../components/Tag';
import Seo from '../components/Seo';

const Index = () => {
    return (
            <div className='aboutContainer'>
            <Seo
                title='Arif Kürsad Kavas | Full-Stack Software Engineer'
                description='Arif Kürsad Kavas is a full-stack software engineer with more than 20 years of experience building software with Go, C#, JavaScript, React, Angular, and cloud technologies.'
                path='/'
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: 'Arif Kürsad Kavas',
                    url: 'https://arifkursadkavas.github.io/',
                    image: 'https://arifkursadkavas.github.io/arif.jpg',
                    jobTitle: 'Full-Stack Software Engineer',
                    description: 'Full-stack software engineer with more than 20 years of professional experience.',
                }}
            />
                <h1>Arif Kürsad Kavas</h1>
                <p>I am a full-stack software engineer with more than 20 years of professional experience building software with a range of programming languages and frontend technologies.</p>
                <p><a href='mailto:arifkavas@gmail.com'>Contact me</a></p>
                <h2>Skills and technologies</h2>
                <section>
                <h3>Backend</h3>
                <div className='tagList'>
                    {['C', 'C++', 'Go', 'C#', 'Java', 'PHP', 'NodeJs'].map((t) => (<Tag text={t} key={t}></Tag>))}
                </div>
                <br />
                </section>
                <section>
                <h3>Frontend</h3>
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
                </section>
        <section>
        <h3>Operating systems</h3>
        <div className='tagList'>
                    {['Linux', 'Solaris'].map((t) => (
                        <Tag text={t} key={t}></Tag>
                    ))}
                </div>
                <br />
        </section>
        <section>
        <h3>Databases</h3>
        <div className='tagList'>
                    {' '}
                    {['Mysql', 'PostgreSql', 'Oracle', 'Mongo', 'DGraph'].map((t) => (
                        <Tag text={t} key={t}></Tag>
                    ))}
                </div>
        </section>
            </div>
    )
}

export default Index