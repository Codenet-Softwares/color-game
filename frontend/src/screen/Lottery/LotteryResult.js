import React, { useEffect, useState } from 'react';
import { Card, Accordion, Spinner, Table } from 'react-bootstrap';
import { getWinningResult } from '../../utils/apiService';

const LotteryResult = () => {
  const [results, setResults] = useState([]); // Initialize results as an empty array
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await getWinningResult(); // Make the API call

      // Check if the response has the correct structure
      if (response && response.success && Array.isArray(response.data)) {
        // Map results to include a default date if missing
        const updatedResults = response.data.map(result => ({
          ...result,
          date: result.date || new Date().toISOString() // Use current date if `date` is not provided
        }));
        setResults(updatedResults);
      } else {
        console.error('Unexpected data format in API response:', response);
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(); // Fetch results on component mount
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
        <span className="ml-2">Loading Results...</span>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-3" style={{ background: '#f0f8ff', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
      <h2 className="text-center mb-4" style={{ color: '#4682B4' }}>Lottery Results</h2>
      <Accordion defaultActiveKey="0">
        {results.length > 0 ? (
          results.map((result, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                <strong>{new Date(result.date).toLocaleDateString()}</strong> - Results for {result.announceTime}
              </Accordion.Header>

              {/* <Accordion.Body>
                {result.data.map((prize, idx) => (
                  <Card key={idx} className="mb-3">
                    <Card.Header style={{ backgroundColor: '#4682B4', color: '#fff', textAlign: 'center' }}>
                      <strong>{prize.prizeCategory}</strong> - Prize Amount: ₹{prize.prizeAmount}
                    </Card.Header>
                    <Card.Body>
                      <h5 className="text-center" style={{ color: '#4682B4' }}>Winning Ticket Numbers</h5>
                      <Table bordered hover responsive className="text-center mt-3">
                        <tbody>
                          <tr>
                            {prize.ticketNumbers && prize.ticketNumbers.length > 0 ? (
                              prize.ticketNumbers.map((ticket, i) => (
                                <td key={i} className="text-info">{ticket}</td>
                              ))
                            ) : (
                              <td className="text-muted">No ticket numbers available</td>
                            )}
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                ))}
              </Accordion.Body> */}

            </Accordion.Item>
          ))
        ) : (
          <p className="text-center">No lottery results available.</p>
        )}
      </Accordion>
    </div>
  );
};

export default LotteryResult;
