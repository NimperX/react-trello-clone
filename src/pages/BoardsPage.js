import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { BoardTitle, BoardModal, BoardsPageSkeleton } from '../components';
import { boardService } from '../services';
import { withAuthorization } from '../utils';

export const BoardsPage = withAuthorization((authUser) => !!authUser)(() => {
    const [boards, setBoards] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setLoading(true);
        (async () => {
            await fetchBoards();
        })();
    }, []);

    const fetchBoards = async () => {
        await boardService.userBoards().on('value', (snapshot) => {
            if (!snapshot) {
                return;
            }
            setBoards(snapshot.val() || {});
            setLoading(false);
        });
    };

    const addBoard = async (board) => {
        await boardService.addBoard(board);
        setModalVisible(false);
    };

    const objectToArray = (data) =>
        !data
            ? []
            : Object.values(data).map((value, index) => ({
                  ...value,
                  key: Object.keys(data)[index],
              }));

    if (loading) {
        return <BoardsPageSkeleton count={4} />;
    }

    return (
        <div className={`pt-16 py-4 px-3`}>
            <div className="flex mb-3 items-center text-xl">
                <UserOutlined className={`mr-2`} /> Personal Boards
            </div>

            <div className="grid grid-cols-4 gap-4">
                {objectToArray(boards).map((board) => (
                    <BoardTitle
                        title={board.title}
                        key={nanoid()}
                        action={() => history.push(`boards/${board?.key}`)}
                    />
                ))}
                <BoardTitle
                    title="Add new board"
                    addition={true}
                    action={() => setModalVisible(true)}
                />
            </div>

            <BoardModal
                action={addBoard}
                closeModal={() => setModalVisible(false)}
                visible={modalVisible}
            />
        </div>
    );
});
