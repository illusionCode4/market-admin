import Layout from '@/components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@/components/Spinner';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      axios.get('/api/reviews').then((response) => {
        setReviews(response.data);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (_id) => {
    await axios.delete('/api/reviews?id=' + _id);
    fetchReviews();
  };
  return (
    <Layout>
      <table className='basic mt-2'>
        <thead>
          <tr>
            <td>Reviews</td>
            <td>Description</td>
            <td>Stars</td>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className='py-4'>
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}

          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review.title}</td>
              <td>{review.description}</td>
              <td>
                {review.stars}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4 inline-block mb-1'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
                  />
                </svg>
              </td>
              <td>
                <button
                  className='btn-red '
                  onClick={() => deleteReview(review._id)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4 inline-block mb-1'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                    />
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
