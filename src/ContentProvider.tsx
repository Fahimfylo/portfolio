import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadContent, getContent, PortfolioContent, portfolioData } from './content';

const ContentContext = createContext<PortfolioContent>(portfolioData);

export function useContent(): PortfolioContent {
  return useContext(ContentContext);
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioContent>(getContent());

  useEffect(() => {
    let alive = true;
    loadContent().then((loaded) => {
      if (alive) setData(loaded);
    });
    return () => {
      alive = false;
    };
  }, []);

  return <ContentContext.Provider value={data}>{children}</ContentContext.Provider>;
};
