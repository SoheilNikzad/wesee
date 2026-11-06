import { TokenizeFormData } from '../types';

export function generateRWASolidityContract(data: TokenizeFormData): string {
  const contractSafeName = data.tokenSymbol.replace(/[^a-zA-Z0-9]/g, '') + 'Token';
  
  return `// SPDX-License-Identifier: MIT
// Created via WeSee RWA Platform (wesee.ir)
pragma solidity ^0.8.20;

/**
 * @title ${contractSafeName}
 * @dev RWA Fractional Asset Token for "${data.title}"
 * Network: ${data.network.toUpperCase()}
 * Asset Valuation: $${data.totalValuationUSD.toLocaleString()}
 * Tokenized Supply: ${data.totalSupply.toLocaleString()} ${data.tokenSymbol}
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable is Context {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

contract ${contractSafeName} is IERC20, Ownable {
    string public name = "${data.tokenName}";
    string public symbol = "${data.tokenSymbol}";
    uint8 public decimals = ${data.decimals};
    uint256 private _totalSupply;

    // RWA Asset Specific Metadata
    string public assetPhysicalReference = "${data.physicalProofRef || 'DOC-REG-VERIFIED'}";
    string public assetLocation = "${data.location}";
    uint256 public assetValuationUSD = ${data.totalValuationUSD};
    uint256 public tokenPriceUSD = ${Math.round(data.totalValuationUSD / data.totalSupply)};

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    ${data.hasWhitelist ? 'mapping(address => bool) public isWhitelisted;' : ''}
    ${data.canPause ? 'bool public paused;' : ''}

    event AssetMetadataUpdated(uint256 newValuation, string newDocHash);
    ${data.hasWhitelist ? 'event WhitelistUpdated(address indexed investor, bool status);' : ''}
    ${data.canPause ? 'event PauseStateChanged(bool isPaused);' : ''}

    constructor() Ownable(msg.sender) {
        uint256 initialSupply = ${data.totalSupply} * 10 ** decimals;
        _totalSupply = initialSupply;
        _balances[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
        
        ${data.hasWhitelist ? 'isWhitelisted[msg.sender] = true;' : ''}
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        _transfer(_msgSender(), to, value);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 value) public override returns (bool) {
        _approve(_msgSender(), spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        _spendAllowance(from, _msgSender(), value);
        _transfer(from, to, value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        ${data.canPause ? 'require(!paused, "RWA: Transfers are currently paused");' : ''}
        ${data.hasWhitelist ? 'require(isWhitelisted[to] && isWhitelisted[from], "RWA: Address not KYC/Whitelisted");' : ''}

        uint256 fromBalance = _balances[from];
        require(fromBalance >= value, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - value;
            _balances[to] += value;
        }

        emit Transfer(from, to, value);
    }

    function _approve(address owner, address spender, uint256 value) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _spendAllowance(address owner, address spender, uint256 value) internal {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= value, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - value);
            }
        }
    }

    ${data.hasWhitelist ? `
    function setWhitelistBatch(address[] calldata investors, bool status) external onlyOwner {
        for (uint256 i = 0; i < investors.length; i++) {
            isWhitelisted[investors[i]] = status;
            emit WhitelistUpdated(investors[i], status);
        }
    }` : ''}

    ${data.canPause ? `
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PauseStateChanged(_paused);
    }` : ''}

    ${data.canBurn ? `
    function burn(uint256 value) external {
        require(_balances[msg.sender] >= value, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[msg.sender] -= value;
            _totalSupply -= value;
        }
        emit Transfer(msg.sender, address(0), value);
    }` : ''}
}
`;
}
