import React, { useEffect, useState } from 'react';
import './index.scss';
import axios from 'axios';
import { Collection, CollectionProps } from './components/Collection';

const categories = [
  { name: 'Все' },
  { name: 'Море' },
  { name: 'Горы' },
  { name: 'Архитектура' },
  { name: 'Города' },
];

export const App: React.FC = () => {
  const [collections, setCollections] = useState<CollectionProps[]>([]);

  const [searchValue, setSearchValue] = useState('');

  const [categoryId, setCategoryId] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);

  const fetchCollections = async () => {
    const category = categoryId ? `category=${categoryId}` : '';
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://649df9fe9bac4a8e669e7eb9.mockapi.io/collections?page=${page}&limit=6&${category}`,
      );
      setCollections(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [categoryId, page]);

  return (
    <div className='App'>
      <h1>Моя коллекция фотографий</h1>
      <div className='top'>
        <ul className='tags'>
          {categories.map((category, index) => (
            <li
              onClick={() => setCategoryId(index)}
              className={categoryId === index ? 'active' : ''}
              key={category.name}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='search-input'
          placeholder='Поиск по названию'
        />
      </div>
      <div className='content'>
        {isLoading ? (
          <h2>Идет загрузка...</h2>
        ) : (
          collections
            .filter((collection) => {
              return collection.name
                .toLowerCase()
                .includes(searchValue.toLowerCase());
            })
            .map((collection, index) => (
              <Collection
                key={index}
                name={collection.name}
                photos={collection.photos}
              />
            ))
        )}
      </div>
      <ul className='pagination'>
        {[...Array(3)].map((_, index) => (
          <li
            key={index}
            className={page === index + 1 ? 'active' : ''}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};
