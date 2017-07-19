import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <header className="site-header">
        <h1 className="logo">
          <img className="logo-svg" src="./images/logo.svg" alt="logo"/>
          Patternizer
        </h1>
        <nav className="site-nav">
          <ul className="site-nav__list">
            <li className="site-nav__item">
              <a className="button button--left" href="/">New Pattern</a>
            </li>
            <li className="site-nav__item">
              <a className="button button--right"href="/">Duplicate</a>
            </li>
            <li className="site-nav__item">
              <a className="button" href="/">Save</a>
            </li>
            <li className="site-nav__item">
              <a className="button" href="/">Code</a>
            </li>
            <li className="site-nav__item dropdown" id="account">
              <a className="button" href="/">Login</a>
              <div className="menu">
                <ul>
                  <li><a href="/">My Patterns</a></li>
                  <li><a href="/">My Account</a></li>
                  <li><a href="/">Log Out</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}
