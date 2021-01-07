import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Formik, Form, Field } from 'formik';
import './index.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotFound from './404';

const getBookmarks = gql`
	{
		bookmarks {
			id
			url
			title
		}
	}
`;
const addBookmark = gql`
	mutation addBookmark($url: String!, $title: String!) {
		addBookmark(url: $url, title: $title) {
			url
			title
		}
	}
`;
const deleteBookmark = gql`
	mutation delBookmark($id: ID!) {
		delBookmark(id: $id) {
			url
			title
		}
	}
`;

export default function Home() {
	const [ addBook ] = useMutation(addBookmark);
	const [ delBook ] = useMutation(deleteBookmark);

	const handleDelete = (event) => {
		delBook({
			variables: {
				id: event.currentTarget.value
			},
			refetchQueries: [ { query: getBookmarks } ]
		});
	};

	const { loading, error, data } = useQuery(getBookmarks);

	return (
		<div className="container">
			<div className="head">
				<h2>Bookmark</h2>
				<Formik
					onSubmit={(value, actions) => {
						addBook({
							variables: {
								url: value.url,
								title: value.title
							},
							refetchQueries: [ { query: getBookmarks } ]
						});
						actions.resetForm({
							values: {
								url: '',
								title: ''
							}
						});
					}}
					initialValues={{
						url: '',
						title: ''
					}}
				>
					{(formik) => (
						<Form onSubmit={formik.handleSubmit}>
							{/* <div className="input-main"> */}
								<div className="input-div">
									<Field type="text" name="url" id="url" placeholder="URL.." />
									<Field type="text" name="title" id="title" placeholder="Title.." />
									<button type="submit">Add Bookmark</button>
								</div>
							{/* </div> */}
						</Form>
					)}
				</Formik>
			</div>

			<div className="data-display">
				{loading ? (
					<div className="loader">
						<CircularProgress />
					</div>
				) : (
					<div className="data-div">
						{data !== undefined || (null && data.bookmarks.length !== 0) ? (
							data.bookmarks.map((data, ind) => (
								<div key={ind} className="div">
									<div className="heading_list">
										<h3>{data.title}</h3>
									</div>
									<div className="button_list">
										<button>
											<a href={data.url} style={{backgroundColor: "white", color: "green",textDecoration: "none"}} target="_blank">
												Link
											</a>
										</button>
										<button onClick={handleDelete} value={data.id}>
											Delete
										</button>
                      <hr style={{padding: "2px 0", backgroundColor: "grey" ,width: "60%"}}/>
									</div>
								</div>
							))
						) : (
							''
						)}
					</div>
				)}
			</div>
		</div>
	);
}
