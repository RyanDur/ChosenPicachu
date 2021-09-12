import React, {FC, useState} from 'react';
import {Button, Menu, MenuItem} from '@material-ui/core';

export const MyMenu: FC = ({children}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(undefined);

    return <article>
                <Button tabIndex={0}
                        aria-controls="basic-menu"
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}>
                    Menu
                </Button>
                <Menu open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      MenuListProps={{
                          'aria-labelledby': 'basic-button',
                      }}>{
                   React.Children.map(children, child => <MenuItem onClick={handleClose}>{child}</MenuItem>)
                }</Menu>
            </article>;
};
